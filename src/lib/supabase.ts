import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

/**
 * Browser client for use in client components
 * Uses cookies for session management
 */
export function createClient_() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Server-side client for API routes and server components
 * Uses service role key for elevated privileges (use with caution)
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Browser client singleton - use this in client components
 */
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getBrowserClient() {
  if (!browserClient) {
    browserClient = createClient_();
  }
  return browserClient;
}

/**
 * Database table operations for TradeDocs
 */
export const supabaseDB = {
  /**
   * Get user orders
   */
  async getUserOrders(userId: string) {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch orders: ${error.message}`);
    return data;
  },

  /**
   * Get single order
   */
  async getOrder(orderId: string) {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw new Error(`Failed to fetch order: ${error.message}`);
    return data;
  },

  /**
   * Create new order
   */
  async createOrder(orderData: {
    user_id: string;
    template_ids: string[];
    total_price: number;
    currency: string;
    email: string;
    status: string;
  }) {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) throw new Error(`Failed to create order: ${error.message}`);
    return data;
  },

  /**
   * Update order status
   */
  async updateOrderStatus(
    orderId: string,
    status: 'pending' | 'completed' | 'failed' | 'refunded'
  ) {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update order: ${error.message}`);
    return data;
  },

  /**
   * Get or create user
   */
  async getOrCreateUser(email: string, name?: string) {
    const supabase = createServerClient();

    // Try to get existing user
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return existingUser;
    }

    // Create new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return newUser;
  },

  /**
   * Update user profile
   */
  async updateUser(userId: string, updates: { name?: string; avatar?: string }) {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update user: ${error.message}`);
    return data;
  },

  /**
   * Store download link or file reference
   */
  async storeOrderDownload(orderId: string, downloadUrl: string, templateIds: string[]) {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('order_downloads')
      .insert([
        {
          order_id: orderId,
          download_url: downloadUrl,
          template_ids: templateIds,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        },
      ])
      .select()
      .single();

    if (error) throw new Error(`Failed to store download: ${error.message}`);
    return data;
  },

  /**
   * Get order downloads
   */
  async getOrderDownloads(orderId: string) {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('order_downloads')
      .select('*')
      .eq('order_id', orderId);

    if (error) throw new Error(`Failed to fetch downloads: ${error.message}`);
    return data;
  },

  /**
   * Log user activity
   */
  async logActivity(userId: string, activityType: string, metadata?: Record<string, any>) {
    const supabase = createServerClient();
    const { error } = await supabase.from('activity_logs').insert([
      {
        user_id: userId,
        activity_type: activityType,
        metadata,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error('Failed to log activity:', error);
    }
  },

  /**
   * Get user activity
   */
  async getUserActivity(userId: string, limit = 20) {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw new Error(`Failed to fetch activity: ${error.message}`);
    return data;
  },

  /**
   * Subscribe to order updates (real-time)
   */
  subscribeToOrderUpdates(orderId: string, callback: (payload: any) => void) {
    const supabase = getBrowserClient();
    return supabase
      .channel(`orders:${orderId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`,
        },
        callback
      )
      .subscribe();
  },

  /**
   * Unsubscribe from real-time updates
   */
  async unsubscribeFromOrderUpdates(orderId: string) {
    const supabase = getBrowserClient();
    return supabase.channel(`orders:${orderId}`).unsubscribe();
  },
};

/**
 * Auth helpers
 */
export const supabaseAuth = {
  /**
   * Get current user session
   */
  async getCurrentUser() {
    const supabase = getBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Sign out user
   */
  async signOut() {
    const supabase = getBrowserClient();
    return await supabase.auth.signOut();
  },

  /**
   * Sign in with email (magic link)
   */
  async signInWithEmail(email: string) {
    const supabase = getBrowserClient();
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });
  },

  /**
   * Sign in with password
   */
  async signInWithPassword(email: string, password: string) {
    const supabase = getBrowserClient();
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  /**
   * Sign up new user
   */
  async signUp(email: string, password: string) {
    const supabase = getBrowserClient();
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      },
    });
  },

  /**
   * Reset password
   */
  async resetPassword(email: string) {
    const supabase = getBrowserClient();
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password`,
    });
  },

  /**
   * Update user password
   */
  async updatePassword(newPassword: string) {
    const supabase = getBrowserClient();
    return await supabase.auth.updateUser({
      password: newPassword,
    });
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = getBrowserClient();
    return supabase.auth.onAuthStateChange(callback);
  },
};

export default getBrowserClient;
