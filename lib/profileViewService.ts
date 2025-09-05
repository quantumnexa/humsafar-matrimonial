import { supabase } from './supabaseClient';

export interface ProfileView {
  id: string;
  viewer_user_id: string;
  viewed_profile_user_id: string;
  viewed_at: string;
  created_at: string;
}

export interface UserViewStats {
  subscription_status: string;
  views_limit: number;
  views_this_month: number; // Note: This represents total views, not monthly
  remaining_views: number;
}

export class ProfileViewService {
  /**
   * Record a profile view for the current user
   * @param viewedProfileUserId - The ID of the profile being viewed
   * @returns Promise with success status and message
   */
  static async recordProfileView(viewedProfileUserId: string): Promise<{
    success: boolean;
    message: string;
    data?: ProfileView;
  }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          success: false,
          message: 'User not authenticated'
        };
      }

      // Prevent users from viewing their own profile
      if (user.id === viewedProfileUserId) {
        return {
          success: false,
          message: 'Cannot view your own profile'
        };
      }

      // Check if user can view more profiles
      const canView = await this.canUserViewMoreProfiles(user.id);
      if (!canView.success || !canView.canView) {
        return {
          success: false,
          message: canView.message || 'View limit exceeded for this month'
        };
      }

      // Check if profile was already viewed
      const { data: existingView } = await supabase
        .from('profile_views')
        .select('id')
        .eq('viewer_user_id', user.id)
        .eq('viewed_profile_user_id', viewedProfileUserId)
        .single();

      if (existingView) {
        return {
          success: false,
          message: 'Profile already viewed'
        };
      }

      // Record the view
      const { data, error } = await supabase
        .from('profile_views')
        .insert({
          viewer_user_id: user.id,
          viewed_profile_user_id: viewedProfileUserId
        })
        .select()
        .single();

      if (error) {
        console.error('Error recording profile view:', error);
        return {
          success: false,
          message: 'Failed to record profile view'
        };
      }

      return {
        success: true,
        message: 'Profile view recorded successfully',
        data
      };
    } catch (error) {
      console.error('Error in recordProfileView:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Check if user can view more profiles
   * @param userId - The user ID to check (optional, uses current user if not provided)
   * @returns Promise with can view status and remaining views
   */
  static async canUserViewMoreProfiles(userId?: string): Promise<{
    success: boolean;
    canView: boolean;
    remainingViews: number;
    message?: string;
  }> {
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return {
            success: false,
            canView: false,
            remainingViews: 0,
            message: 'User not authenticated'
          };
        }
        targetUserId = user.id;
      }

      // Temporary fix: Manual calculation until database function is fixed
      // Get user's subscription info
      const { data: subscriptionData, error: subError } = await supabase
        .from('user_subscriptions')
        .select('views_limit')
        .eq('user_id', targetUserId)
        .single();

      if (subError || !subscriptionData) {
        console.error('Error getting user subscription:', subError);
        return {
          success: false,
          canView: false,
          remainingViews: 0,
          message: 'No subscription found'
        };
      }

      // Get user's total views count
      const { count: totalViews, error: viewsError } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('viewer_user_id', targetUserId);

      if (viewsError) {
        console.error('Error counting user views:', viewsError);
        return {
          success: false,
          canView: false,
          remainingViews: 0,
          message: 'Failed to count views'
        };
      }

      const remainingViews = Math.max(0, subscriptionData.views_limit - (totalViews || 0));
      
      return {
        success: true,
        canView: remainingViews > 0,
        remainingViews,
        message: remainingViews > 0 ? `${remainingViews} views remaining` : 'View limit reached'
      };
    } catch (error) {
      console.error('Error in canUserViewMoreProfiles:', error);
      return {
        success: false,
        canView: false,
        remainingViews: 0,
        message: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Get user's view statistics
   * @param userId - The user ID to get stats for (optional, uses current user if not provided)
   * @returns Promise with user view statistics
   */
  static async getUserViewStats(userId?: string): Promise<{
    success: boolean;
    data?: UserViewStats;
    message?: string;
  }> {
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return {
            success: false,
            message: 'User not authenticated'
          };
        }
        targetUserId = user.id;
      }

      // Get user subscription info
      const { data: subscription, error: subError } = await supabase
        .from('user_subscriptions')
        .select('subscription_status, views_limit')
        .eq('user_id', targetUserId)
        .single();

      if (subError || !subscription) {
        console.error('Error fetching user subscription:', subError);
        return {
          success: false,
          message: 'No subscription found for user'
        };
      }

      // Check if views_limit is set
      if (subscription.views_limit === null || subscription.views_limit === undefined) {
        return {
          success: false,
          message: 'Views limit not set for user subscription'
        };
      }

      // Get total views count
      const { count: totalViews, error: viewsError } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('viewer_user_id', targetUserId);

      if (viewsError) {
        console.error('Error counting profile views:', viewsError);
        return {
          success: false,
          message: 'Failed to count profile views'
        };
      }

      const viewsLimit = subscription.views_limit;
      const currentViews = totalViews || 0;
      const remainingViews = Math.max(0, viewsLimit - currentViews);

      return {
        success: true,
        data: {
          subscription_status: subscription.subscription_status,
          views_limit: viewsLimit,
          views_this_month: currentViews,
          remaining_views: remainingViews
        }
      };
    } catch (error) {
      console.error('Error in getUserViewStats:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Get all profiles viewed by user
   * @param userId - The user ID to get viewed profiles for (optional, uses current user if not provided)
   * @returns Promise with list of viewed profiles
   */
  static async getViewedProfilesThisMonth(userId?: string): Promise<{
    success: boolean;
    data?: ProfileView[];
    message?: string;
  }> {
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return {
            success: false,
            message: 'User not authenticated'
          };
        }
        targetUserId = user.id;
      }

      const { data, error } = await supabase
        .from('profile_views')
        .select('*')
        .eq('viewer_user_id', targetUserId)
        .order('viewed_at', { ascending: false });

      if (error) {
        console.error('Error fetching viewed profiles:', error);
        return {
          success: false,
          message: 'Failed to fetch viewed profiles'
        };
      }

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Error in getViewedProfilesThisMonth:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Check if a specific profile has been viewed by the user
   * @param viewedProfileUserId - The ID of the profile to check
   * @param userId - The user ID to check for (optional, uses current user if not provided)
   * @returns Promise with viewed status
   */
  static async hasUserViewedProfile(viewedProfileUserId: string, userId?: string): Promise<{
    success: boolean;
    hasViewed: boolean;
    viewedAt?: string;
    message?: string;
  }> {
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          return {
            success: false,
            hasViewed: false,
            message: 'User not authenticated'
          };
        }
        targetUserId = user.id;
      }

      const { data, error } = await supabase
        .from('profile_views')
        .select('viewed_at')
        .eq('viewer_user_id', targetUserId)
        .eq('viewed_profile_user_id', viewedProfileUserId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error checking if profile was viewed:', error);
        return {
          success: false,
          hasViewed: false,
          message: 'Failed to check view status'
        };
      }

      return {
        success: true,
        hasViewed: !!data,
        viewedAt: data?.viewed_at
      };
    } catch (error) {
      console.error('Error in hasUserViewedProfile:', error);
      return {
        success: false,
        hasViewed: false,
        message: 'An unexpected error occurred'
      };
    }
  }
}

export default ProfileViewService;
