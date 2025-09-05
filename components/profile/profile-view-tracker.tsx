'use client'

import { useEffect } from 'react'
import { ProfileViewService } from '@/lib/profileViewService'
import { supabase } from '@/lib/supabaseClient'

interface ProfileViewTrackerProps {
  profileUserId: string
}

export default function ProfileViewTracker({ profileUserId }: ProfileViewTrackerProps) {
  useEffect(() => {
    const recordView = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          console.log('No authenticated user, skipping view tracking')
          return
        }

        // Don't track if user is viewing their own profile
        if (user.id === profileUserId) {
          console.log('User viewing own profile, skipping view tracking')
          return
        }

        // Record the profile view
        const result = await ProfileViewService.recordProfileView(profileUserId)
        
        if (result.success) {
          console.log('Profile view recorded successfully')
        } else {
          console.log('Failed to record profile view:', result.message)
        }
      } catch (error) {
        console.error('Error recording profile view:', error)
      }
    }

    recordView()
  }, [profileUserId])

  // This component doesn't render anything visible
  return null
}