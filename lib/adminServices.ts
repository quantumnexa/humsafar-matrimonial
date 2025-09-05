import { supabase } from './supabaseClient'

// Types for admin data
export interface AdminPayment {
  id: string
  user_id: string
  transaction_id: string
  amount: number
  currency: string
  payment_method: string
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled'
  payment_gateway: string
  description: string
  created_at: string
  updated_at: string
  user?: {
    first_name: string
    last_name: string
    email: string
  }
}

export interface AdminRefund {
  id: string
  payment_id: string
  user_id: string
  refund_amount: number
  refund_reason: string
  refund_status: 'pending' | 'approved' | 'rejected' | 'processed'
  admin_notes: string
  created_at: string
  payment?: AdminPayment
}

export interface AdminPromoCode {
  id: string
  code: string
  name: string
  description: string
  discount_type: 'percentage' | 'fixed_amount' | 'free_shipping'
  discount_value: number
  minimum_amount: number
  usage_limit: number
  used_count: number
  is_active: boolean
  valid_from: string
  valid_until: string
  created_at: string
}

export interface AdminMatchmaker {
  id: string
  user_id: string
  name: string
  phone: string
  email: string
  location: string
  experience_years: number
  specializations: string[]
  rating: number
  total_ratings: number
  success_rate: number
  status: 'active' | 'inactive' | 'busy' | 'suspended'
  bio: string
  hourly_rate: number
  languages: string[]
  certifications: string[]
  created_at: string
}

export interface AdminContentReport {
  id: string
  reporter_id: string
  reported_user_id: string
  content_type: string
  reason: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'under_review' | 'resolved' | 'dismissed'
  admin_notes: string
  created_at: string
  reporter?: {
    first_name: string
    last_name: string
  }
  reported_user?: {
    first_name: string
    last_name: string
  }
}

export interface AdminStats {
  totalPayments: number
  totalRevenue: number
  pendingPayments: number
  totalRefunds: number
  totalPromoCodes: number
  activePromoCodes: number
  totalMatchmakers: number
  activeMatchmakers: number
  pendingReports: number
  totalUsers: number
  activeSubscriptions: number
}

// Payment Services
export const adminPaymentServices = {
  // Get all payments with pagination
  async getPayments(page = 1, limit = 10, status?: string): Promise<{ data: AdminPayment[], count: number }> {
    let query = supabase
      .from('admin_payments')
      .select(`
        *,
        user:user_profiles!admin_payments_user_id_fkey(first_name, last_name, email)
      `, { count: 'exact' })

    if (status) {
      query = query.eq('payment_status', status)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) throw error
    return { data: data || [], count: count || 0 }
  },

  // Get payment statistics
  async getPaymentStats(): Promise<{
    totalPayments: number
    totalRevenue: number
    pendingPayments: number
    completedPayments: number
    failedPayments: number
    refundedPayments: number
  }> {
    const { data, error } = await supabase
      .from('admin_payments')
      .select('amount, payment_status')

    if (error) throw error

    const stats = {
      totalPayments: data.length,
      totalRevenue: 0,
      pendingPayments: 0,
      completedPayments: 0,
      failedPayments: 0,
      refundedPayments: 0
    }

    data.forEach(payment => {
      if (payment.payment_status === 'completed') {
        stats.totalRevenue += payment.amount
        stats.completedPayments++
      } else if (payment.payment_status === 'pending') {
        stats.pendingPayments++
      } else if (payment.payment_status === 'failed') {
        stats.failedPayments++
      } else if (payment.payment_status === 'refunded') {
        stats.refundedPayments++
      }
    })

    return stats
  },

  // Update payment status
  async updatePaymentStatus(paymentId: string, status: string, adminNotes?: string): Promise<void> {
    const { error } = await supabase
      .from('admin_payments')
      .update({ 
        payment_status: status, 
        admin_notes: adminNotes,
        processed_at: status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', paymentId)

    if (error) throw error
  }
}

// Refund Services
export const adminRefundServices = {
  // Get all refunds
  async getRefunds(page = 1, limit = 10): Promise<{ data: AdminRefund[], count: number }> {
    const { data, error, count } = await supabase
      .from('admin_refunds')
      .select(`
        *,
        payment:admin_payments!admin_refunds_payment_id_fkey(*)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) throw error
    return { data: data || [], count: count || 0 }
  },

  // Process refund
  async processRefund(refundId: string, status: string, adminNotes?: string): Promise<void> {
    const { error } = await supabase
      .from('admin_refunds')
      .update({ 
        refund_status: status, 
        admin_notes: adminNotes,
        processed_at: status === 'processed' ? new Date().toISOString() : null
      })
      .eq('id', refundId)

    if (error) throw error
  }
}

// Promo Code Services
export const adminPromoCodeServices = {
  // Get all promo codes
  async getPromoCodes(): Promise<AdminPromoCode[]> {
    const { data, error } = await supabase
      .from('admin_promo_codes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create new promo code
  async createPromoCode(promoData: Omit<AdminPromoCode, 'id' | 'created_at'>): Promise<AdminPromoCode> {
    const { data, error } = await supabase
      .from('admin_promo_codes')
      .insert(promoData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update promo code
  async updatePromoCode(id: string, updates: Partial<AdminPromoCode>): Promise<void> {
    const { error } = await supabase
      .from('admin_promo_codes')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  },

  // Delete promo code
  async deletePromoCode(id: string): Promise<void> {
    const { error } = await supabase
      .from('admin_promo_codes')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Matchmaker Services
export const adminMatchmakerServices = {
  // Get all matchmakers
  async getMatchmakers(): Promise<AdminMatchmaker[]> {
    const { data, error } = await supabase
      .from('admin_matchmakers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Get matchmaker assignments
  async getMatchmakerAssignments(matchmakerId?: string): Promise<any[]> {
    let query = supabase
      .from('admin_matchmaker_assignments')
      .select(`
        *,
        matchmaker:admin_matchmakers!admin_matchmaker_assignments_matchmaker_id_fkey(name, email),
        user:user_profiles!admin_matchmaker_assignments_user_id_fkey(first_name, last_name, email)
      `)

    if (matchmakerId) {
      query = query.eq('matchmaker_id', matchmakerId)
    }

    const { data, error } = await query.order('assigned_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Create new matchmaker
  async createMatchmaker(matchmakerData: Omit<AdminMatchmaker, 'id' | 'created_at'>): Promise<AdminMatchmaker> {
    const { data, error } = await supabase
      .from('admin_matchmakers')
      .insert(matchmakerData)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update matchmaker
  async updateMatchmaker(id: string, updates: Partial<AdminMatchmaker>): Promise<void> {
    const { error } = await supabase
      .from('admin_matchmakers')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  }
}

// Content Moderation Services
export const adminModerationServices = {
  // Get all content reports
  async getContentReports(page = 1, limit = 10): Promise<{ data: AdminContentReport[], count: number }> {
    const { data, error, count } = await supabase
      .from('admin_content_reports')
      .select(`
        *,
        reporter:user_profiles!admin_content_reports_reporter_id_fkey(first_name, last_name),
        reported_user:user_profiles!admin_content_reports_reported_user_id_fkey(first_name, last_name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) throw error
    return { data: data || [], count: count || 0 }
  },

  // Update report status
  async updateReportStatus(reportId: string, status: string, adminNotes?: string): Promise<void> {
    const { error } = await supabase
      .from('admin_content_reports')
      .update({ 
        status, 
        admin_notes: adminNotes,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', reportId)

    if (error) throw error
  }
}

// Dashboard Statistics
export const adminDashboardServices = {
  // Get comprehensive dashboard statistics
  async getDashboardStats(): Promise<AdminStats> {
    // Get payment stats
    const paymentStats = await adminPaymentServices.getPaymentStats()
    
    // Get promo code stats
    const promoCodes = await adminPromoCodeServices.getPromoCodes()
    const activePromoCodes = promoCodes.filter(code => code.is_active).length
    
    // Get matchmaker stats
    const matchmakers = await adminMatchmakerServices.getMatchmakers()
    const activeMatchmakers = matchmakers.filter(m => m.status === 'active').length
    
    // Get content report stats
    const reports = await adminModerationServices.getContentReports(1, 1000)
    const pendingReports = reports.data.filter(r => r.status === 'pending').length
    
    // Get user stats (assuming user_profiles table exists)
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    // Get subscription stats
    const { count: activeSubscriptions } = await supabase
      .from('admin_user_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    return {
      totalPayments: paymentStats.totalPayments,
      totalRevenue: paymentStats.totalRevenue,
      pendingPayments: paymentStats.pendingPayments,
      totalRefunds: 0, // You can implement this
      totalPromoCodes: promoCodes.length,
      activePromoCodes,
      totalMatchmakers: matchmakers.length,
      activeMatchmakers,
      pendingReports,
      totalUsers: totalUsers || 0,
      activeSubscriptions: activeSubscriptions || 0
    }
  },

  // Get recent activity
  async getRecentActivity(limit = 10): Promise<any[]> {
    const { data, error } = await supabase
      .from('admin_activity_log')
      .select(`
        *,
        admin:user_profiles!admin_activity_log_admin_id_fkey(first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }
}

// Utility function to log admin actions
export const logAdminAction = async (
  adminId: string, 
  action: string, 
  tableName: string, 
  recordId: string, 
  oldValues?: any, 
  newValues?: any
): Promise<void> => {
  const { error } = await supabase
    .from('admin_activity_log')
    .insert({
      admin_id: adminId,
      action,
      table_name: tableName,
      record_id: recordId,
      old_values: oldValues,
      new_values: newValues
    })

  if (error) {
    console.error('Failed to log admin action:', error)
  }
}
