# Profile Views Tracking System

This document explains the profile views tracking system that has been implemented for the matrimonial application.

## Overview

The system tracks which profiles each user has viewed and enforces view limits based on their subscription plan. Users can only view a limited total number of profiles according to their subscription's `views_limit`.

## Database Structure

### New Table: `profile_views`

```sql
CREATE TABLE profile_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    viewer_user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    viewed_profile_user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(viewer_user_id, viewed_profile_user_id), -- Prevent duplicate views
    CHECK (viewer_user_id != viewed_profile_user_id) -- Prevent self-viewing
);
```

### Updated Table: `user_subscriptions`

Added `views_limit` column:
- **Free users**: 5 total views
- **Premium Lite**: 20 total views
- **Premium Classic**: 30 total views
- **Premium Plus**: 60 total views
- **Humsafar Select**: Unlimited views (999999)

## Setup Instructions

### 1. Run the SQL Script

Execute the SQL script to create the table and functions:

```bash
# Connect to your database and run:
psql -d your_database -f create_profile_views_table.sql
```

Or copy and paste the contents of `create_profile_views_table.sql` into your database management tool.

### 2. Import the Service

The TypeScript service is available in `lib/profileViewService.ts`:

```typescript
import { ProfileViewService } from '@/lib/profileViewService';
```

## Usage Examples

### 1. Record a Profile View

```typescript
// When a user views a profile
const result = await ProfileViewService.recordProfileView('profile-user-id');

if (result.success) {
  console.log('Profile view recorded:', result.message);
} else {
  console.error('Failed to record view:', result.message);
}
```

### 2. Check if User Can View More Profiles

```typescript
// Before showing a profile
const canView = await ProfileViewService.canUserViewMoreProfiles();

if (canView.canView) {
  // Show the profile
  console.log(`${canView.remainingViews} views remaining`);
} else {
  // Show upgrade message
  console.log('View limit reached for this month');
}
```

### 3. Get User's View Statistics

```typescript
// Get user's current view statistics
const stats = await ProfileViewService.getUserViewStats();

if (stats.success && stats.data) {
  console.log(`Subscription: ${stats.data.subscription_status}`);
  console.log(`Total views: ${stats.data.views_this_month}/${stats.data.views_limit}`);
  console.log(`Remaining views: ${stats.data.remaining_views}`);
}
```

### 4. Check if Profile Already Viewed

```typescript
// Check if user has already viewed a specific profile
const hasViewed = await ProfileViewService.hasUserViewedProfile('profile-user-id');

if (hasViewed.hasViewed) {
  console.log(`Profile viewed on: ${hasViewed.viewedAt}`);
} else {
  console.log('Profile not yet viewed');
}
```

### 5. Get All Viewed Profiles

```typescript
// Get list of all profiles viewed
const viewedProfiles = await ProfileViewService.getViewedProfilesThisMonth();

if (viewedProfiles.success && viewedProfiles.data) {
  console.log(`Viewed ${viewedProfiles.data.length} profiles total`);
  viewedProfiles.data.forEach(view => {
    console.log(`Viewed profile ${view.viewed_profile_user_id} on ${view.viewed_at}`);
  });
}
```

## Integration with Profile Pages

### Example: Profile Detail Page

```typescript
// app/profile/[id]/page.tsx
import { ProfileViewService } from '@/lib/profileViewService';

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const profileId = params.id;
  
  // Check if user can view more profiles
  const canView = await ProfileViewService.canUserViewMoreProfiles();
  
  if (!canView.canView) {
    return (
      <div className="text-center p-8">
        <h2>View Limit Reached</h2>
        <p>You have reached your profile view limit.</p>
        <p>Upgrade your subscription to view more profiles.</p>
      </div>
    );
  }
  
  // Check if already viewed
  const hasViewed = await ProfileViewService.hasUserViewedProfile(profileId);
  
  // Record the view (only if not already viewed)
  if (!hasViewed.hasViewed) {
    await ProfileViewService.recordProfileView(profileId);
  }
  
  // Render profile...
  return (
    <div>
      {/* Profile content */}
      <div className="text-sm text-gray-500">
        {hasViewed.hasViewed ? (
          <p>Previously viewed on {new Date(hasViewed.viewedAt!).toLocaleDateString()}</p>
        ) : (
          <p>First time viewing this profile</p>
        )}
        <p>{canView.remainingViews} views remaining</p>
      </div>
    </div>
  );
}
```

### Example: Profile List with View Status

```typescript
// components/ProfileCard.tsx
import { ProfileViewService } from '@/lib/profileViewService';

interface ProfileCardProps {
  profile: any;
  userId: string;
}

export default function ProfileCard({ profile, userId }: ProfileCardProps) {
  const [hasViewed, setHasViewed] = useState(false);
  const [canView, setCanView] = useState(true);
  
  useEffect(() => {
    const checkViewStatus = async () => {
      const viewStatus = await ProfileViewService.hasUserViewedProfile(profile.id);
      setHasViewed(viewStatus.hasViewed);
      
      const viewLimit = await ProfileViewService.canUserViewMoreProfiles();
      setCanView(viewLimit.canView);
    };
    
    checkViewStatus();
  }, [profile.id]);
  
  const handleViewProfile = async () => {
    if (!canView && !hasViewed) {
      alert('You have reached your view limit');
      return;
    }
    
    if (!hasViewed) {
      await ProfileViewService.recordProfileView(profile.id);
      setHasViewed(true);
    }
    
    // Navigate to profile page
    router.push(`/profile/${profile.id}`);
  };
  
  return (
    <div className="profile-card">
      {/* Profile content */}
      <button 
        onClick={handleViewProfile}
        disabled={!canView && !hasViewed}
        className={`btn ${hasViewed ? 'btn-secondary' : 'btn-primary'}`}
      >
        {hasViewed ? 'View Again' : canView ? 'View Profile' : 'Limit Reached'}
      </button>
      {hasViewed && <span className="text-sm text-gray-500">✓ Viewed</span>}
    </div>
  );
}
```

## Database Functions

The system includes helpful database functions:

### `can_user_view_more_profiles(user_id UUID)`
Returns boolean indicating if user can view more profiles.

### `get_user_remaining_views(user_id UUID)`
Returns the number of remaining views for the user.

## Security Features

1. **Row Level Security (RLS)**: Users can only see their own view history
2. **Unique Constraints**: Prevents duplicate views of the same profile
3. **Self-View Prevention**: Users cannot view their own profiles
4. **Automatic Limit Enforcement**: Database-level checks prevent exceeding limits

## Total View Tracking

View limits are tracked cumulatively. The system tracks all views throughout the user's subscription period.

## Admin Features

**Note**: Admin access to profile views is temporarily disabled to fix infinite recursion issues with RLS policies. This will be re-enabled once the circular dependency between admin_users and profile_views policies is resolved.

~~Admins can view all profile views across the system for monitoring and analytics purposes.~~

## Troubleshooting

### Common Issues

1. **"User not authenticated" error**: Ensure user is logged in before calling service methods
2. **"Profile already viewed" error**: This is expected behavior to prevent duplicate counting
3. **"View limit exceeded" error**: User has reached their total view limit

### Database Queries for Debugging

```sql
-- Check user's total view count
SELECT COUNT(*) as total_views
FROM profile_views 
WHERE viewer_user_id = 'user-id-here';

-- Check user's subscription and limits
SELECT subscription_status, views_limit
FROM user_subscriptions 
WHERE user_id = 'user-id-here';

-- Get user's remaining views
SELECT get_user_remaining_views('user-id-here');
```

This system provides a complete solution for tracking profile views with total subscription-based limits, ensuring fair usage and encouraging subscription upgrades.