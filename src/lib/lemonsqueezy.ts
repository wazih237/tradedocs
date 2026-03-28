import crypto from 'crypto';
import { LemonSqueezyCheckout, LemonSqueezyOrder } from './types';

const API_BASE_URL = 'https://api.lemonsqueezy.com/v1';
const API_KEY = process.env.LEMON_SQUEEZY_API_KEY!;
const WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET!;
const STORE_ID = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_STORE_ID!;

/**
 * Helper function to make authenticated API requests to Lemon Squeezy
 */
async function lemonsqueezyFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Lemon Squeezy API Error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  return response.json();
}

/**
 * Create a checkout session for one or more templates
 * Returns checkout URL and session ID
 */
export async function createCheckout(
  productVariants: Array<{ productVariantId: string; quantity: number }>,
  email: string,
  customData?: Record<string, any>
): Promise<LemonSqueezyCheckout> {
  try {
    const items = productVariants.map((variant) => ({
      product_variant_id: variant.productVariantId,
      quantity: variant.quantity,
    }));

    const response = await lemonsqueezyFetch('/checkouts', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email,
              custom: customData || {},
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: STORE_ID,
              },
            },
            variant: {
              data: items.length === 1
                ? {
                    type: 'product-variants',
                    id: items[0].product_variant_id,
                  }
                : undefined,
            },
          },
        },
      }),
    });

    // For multiple items, create custom variant bundle
    if (productVariants.length > 1) {
      return await createBundledCheckout(productVariants, email, customData);
    }

    return {
      checkoutUrl: response.data.attributes.url,
      checkoutId: response.data.id,
    };
  } catch (error) {
    console.error('Failed to create checkout:', error);
    throw error;
  }
}

/**
 * Create a bundled checkout for multiple product variants
 */
async function createBundledCheckout(
  productVariants: Array<{ productVariantId: string; quantity: number }>,
  email: string,
  customData?: Record<string, any>
): Promise<LemonSqueezyCheckout> {
  try {
    // Create a cart-like checkout with multiple items
    const response = await lemonsqueezyFetch('/checkouts', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              email,
              custom: {
                ...customData,
                bundled_items: productVariants,
              },
            },
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: STORE_ID,
              },
            },
          },
        },
      }),
    });

    return {
      checkoutUrl: response.data.attributes.url,
      checkoutId: response.data.id,
    };
  } catch (error) {
    console.error('Failed to create bundled checkout:', error);
    throw error;
  }
}

/**
 * Get order details by Lemon Squeezy order ID
 */
export async function getOrder(orderId: string): Promise<LemonSqueezyOrder> {
  try {
    const response = await lemonsqueezyFetch(`/orders/${orderId}`);

    const order = response.data;
    const attributes = order.attributes;

    return {
      id: order.id,
      orderId: attributes.order_number,
      status: attributes.status,
      email: attributes.customer_email,
      total: attributes.total,
      currency: attributes.currency,
      createdAt: attributes.created_at,
      updatedAt: attributes.updated_at,
      customerEmail: attributes.customer_email,
      productVariants: attributes.product_variants || [],
    };
  } catch (error) {
    console.error('Failed to get order:', error);
    throw error;
  }
}

/**
 * Get user's orders
 */
export async function getUserOrders(
  customerId: string
): Promise<LemonSqueezyOrder[]> {
  try {
    const response = await lemonsqueezyFetch(`/customers/${customerId}/orders`);

    return response.data.map((order: any) => ({
      id: order.id,
      orderId: order.attributes.order_number,
      status: order.attributes.status,
      email: order.attributes.customer_email,
      total: order.attributes.total,
      currency: order.attributes.currency,
      createdAt: order.attributes.created_at,
      updatedAt: order.attributes.updated_at,
      customerEmail: order.attributes.customer_email,
    }));
  } catch (error) {
    console.error('Failed to get user orders:', error);
    throw error;
  }
}

/**
 * Refund an order (full or partial)
 */
export async function refundOrder(
  orderId: string,
  amount?: number
): Promise<{ success: boolean; refundId: string }> {
  try {
    const response = await lemonsqueezyFetch(`/orders/${orderId}/refunds`, {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'refunds',
          attributes: {
            amount: amount || null, // null = full refund
          },
        },
      }),
    });

    return {
      success: true,
      refundId: response.data.id,
    };
  } catch (error) {
    console.error('Failed to refund order:', error);
    throw error;
  }
}

/**
 * Verify webhook signature from Lemon Squeezy
 * Returns true if signature is valid
 */
export function verifyWebhookSignature(
  body: string | Buffer,
  signature: string | undefined,
  secret: string
): boolean {
  if (!signature) {
    console.error('Missing X-Signature header');
    return false;
  }

  try {
    // Lemon Squeezy uses HMAC SHA256
    const hash = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    // Compare signatures in constant time to prevent timing attacks
    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

/**
 * Process webhook event from Lemon Squeezy
 */
export async function processWebhookEvent(
  event: any
): Promise<{
  orderId: string;
  status: string;
  email: string;
  action: 'order_created' | 'order_completed' | 'order_refunded' | 'unknown';
}> {
  const eventType = event.meta?.event_name;
  const data = event.data?.attributes;

  let action: 'order_created' | 'order_completed' | 'order_refunded' | 'unknown' = 'unknown';

  switch (eventType) {
    case 'order_created':
      action = 'order_created';
      break;
    case 'order_completed':
      action = 'order_completed';
      break;
    case 'refund_created':
      action = 'order_refunded';
      break;
    default:
      console.warn(`Unknown webhook event type: ${eventType}`);
  }

  return {
    orderId: event.data?.id || data?.order_number || 'unknown',
    status: data?.status || 'unknown',
    email: data?.customer_email || data?.email || '',
    action,
  };
}

/**
 * Create or get a customer
 */
export async function createOrGetCustomer(
  email: string,
  name?: string
): Promise<{ customerId: string; created: boolean }> {
  try {
    // Try to find existing customer
    const listResponse = await lemonsqueezyFetch(
      `/stores/${STORE_ID}/customers?filter[email]=${encodeURIComponent(email)}`
    );

    if (listResponse.data && listResponse.data.length > 0) {
      return {
        customerId: listResponse.data[0].id,
        created: false,
      };
    }

    // Create new customer
    const createResponse = await lemonsqueezyFetch(`/customers`, {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'customers',
          attributes: {
            email,
            name: name || email.split('@')[0],
          },
          relationships: {
            store: {
              data: {
                type: 'stores',
                id: STORE_ID,
              },
            },
          },
        },
      }),
    });

    return {
      customerId: createResponse.data.id,
      created: true,
    };
  } catch (error) {
    console.error('Failed to create or get customer:', error);
    throw error;
  }
}

/**
 * Get product variants (templates) available for sale
 */
export async function getProductVariants(): Promise<
  Array<{
    id: string;
    name: string;
    price: number;
    currency: string;
    productId: string;
  }>
> {
  try {
    const response = await lemonsqueezyFetch(`/stores/${STORE_ID}/product-variants`);

    return response.data.map((variant: any) => ({
      id: variant.id,
      name: variant.attributes.name,
      price: variant.attributes.price,
      currency: variant.attributes.currency,
      productId: variant.attributes.product_id,
    }));
  } catch (error) {
    console.error('Failed to get product variants:', error);
    throw error;
  }
}

/**
 * Get products (categories/bundles)
 */
export async function getProducts(): Promise<
  Array<{
    id: string;
    name: string;
    description: string;
  }>
> {
  try {
    const response = await lemonsqueezyFetch(`/stores/${STORE_ID}/products`);

    return response.data.map((product: any) => ({
      id: product.id,
      name: product.attributes.name,
      description: product.attributes.description || '',
    }));
  } catch (error) {
    console.error('Failed to get products:', error);
    throw error;
  }
}

/**
 * Update customer email/details
 */
export async function updateCustomer(
  customerId: string,
  updates: { email?: string; name?: string }
): Promise<void> {
  try {
    await lemonsqueezyFetch(`/customers/${customerId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          type: 'customers',
          id: customerId,
          attributes: updates,
        },
      }),
    });
  } catch (error) {
    console.error('Failed to update customer:', error);
    throw error;
  }
}

/**
 * Check license key validity (for digital product delivery)
 */
export async function validateLicense(licenseKey: string): Promise<boolean> {
  try {
    const response = await lemonsqueezyFetch(
      `/licenses/validate?key=${encodeURIComponent(licenseKey)}`
    );
    return response.valid === true;
  } catch (error) {
    console.error('Failed to validate license:', error);
    return false;
  }
}

/**
 * Get subscription details
 */
export async function getSubscription(subscriptionId: string): Promise<any> {
  try {
    const response = await lemonsqueezyFetch(`/subscriptions/${subscriptionId}`);
    return response.data;
  } catch (error) {
    console.error('Failed to get subscription:', error);
    throw error;
  }
}

/**
 * Pause subscription
 */
export async function pauseSubscription(subscriptionId: string): Promise<void> {
  try {
    await lemonsqueezyFetch(`/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          type: 'subscriptions',
          id: subscriptionId,
          attributes: {
            pause: true,
          },
        },
      }),
    });
  } catch (error) {
    console.error('Failed to pause subscription:', error);
    throw error;
  }
}

/**
 * Resume subscription
 */
export async function resumeSubscription(subscriptionId: string): Promise<void> {
  try {
    await lemonsqueezyFetch(`/subscriptions/${subscriptionId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          type: 'subscriptions',
          id: subscriptionId,
          attributes: {
            pause: false,
          },
        },
      }),
    });
  } catch (error) {
    console.error('Failed to resume subscription:', error);
    throw error;
  }
}

export default {
  createCheckout,
  getOrder,
  getUserOrders,
  refundOrder,
  verifyWebhookSignature,
  processWebhookEvent,
  createOrGetCustomer,
  getProductVariants,
  getProducts,
  updateCustomer,
  validateLicense,
  getSubscription,
  pauseSubscription,
  resumeSubscription,
};
