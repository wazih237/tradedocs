export type TemplateStatus = 'mandatory' | 'recommended' | 'optional';

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  commodities: string[];
  markets: string[];
  status: TemplateStatus;
  popularity: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  templateCount: number;
}

export interface Order {
  id: string;
  orderId: string;
  userId: string;
  templateIds: string[];
  totalPrice: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  email: string;
  createdAt: Date;
  completedAt?: Date;
  checkoutUrl?: string;
  downloadUrl?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  stripeCustomerId?: string;
}

export interface CartItem {
  templateId: string;
  quantity: number;
  addedAt: Date;
}

export interface WebhookPayload {
  data: {
    attributes: {
      order_number?: string;
      status?: string;
      customer_email?: string;
      total?: number;
      [key: string]: any;
    };
  };
}

export interface LemonSqueezyCheckout {
  checkoutUrl: string;
  checkoutId: string;
}

export interface LemonSqueezyOrder {
  id: string;
  orderId: string;
  status: string;
  email: string;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  customerEmail: string;
  productVariants?: Array<{
    id: string;
    name: string;
  }>;
}

export interface TemplateSearchParams {
  query?: string;
  category?: string;
  status?: TemplateStatus;
  commodities?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'popularity' | 'price-asc' | 'price-desc' | 'name';
}
