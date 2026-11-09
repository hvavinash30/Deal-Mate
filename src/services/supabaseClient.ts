import { createClient } from '@supabase/supabase-js';

// Access client-side Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('xyzcompany')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SavedDeal {
  id?: string;
  user_id?: string;
  product_name: string;
  original_price: number;
  negotiated_price: number;
  savings_amount: number;
  savings_percentage: number;
  coupon_code?: string;
  merchant_name?: string;
  product_url?: string;
  status: 'negotiating' | 'deal_secured' | 'purchased' | 'expired';
  created_at?: string;
}

// Helper methods for easy UI interaction
export const DealMateDB = {
  // Save or log a negotiated deal
  async saveNegotiatedDeal(deal: SavedDeal) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase is not configured yet. Saving to local storage demo store.');
      const local = JSON.parse(localStorage.getItem('dealmate_saved_deals') || '[]');
      const saved = { ...deal, id: `local_${Date.now()}`, created_at: new Date().toISOString() };
      local.unshift(saved);
      localStorage.setItem('dealmate_saved_deals', JSON.stringify(local));
      return { data: saved, error: null };
    }

    const { data, error } = await supabase
      .from('deals')
      .insert([deal])
      .select()
      .single();

    return { data, error };
  },

  // Retrieve user's past deals & savings
  async getUserDeals(userId?: string) {
    if (!isSupabaseConfigured) {
      const local = JSON.parse(localStorage.getItem('dealmate_saved_deals') || '[]');
      return { data: local, error: null };
    }

    let query = supabase.from('deals').select('*').order('created_at', { ascending: false });
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    return { data, error };
  },

  // Realtime subscription for deal status updates (e.g. seller approves counter-offer)
  subscribeToDealUpdates(dealId: string, onUpdate: (payload: any) => void) {
    if (!isSupabaseConfigured) return { unsubscribe: () => {} };

    const channel = supabase
      .channel(`deal_${dealId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'deals', filter: `id=eq.${dealId}` }, onUpdate)
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      }
    };
  }
};
