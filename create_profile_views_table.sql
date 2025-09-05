-- Profile Views Tracking Table Creation Script
-- This table tracks which profiles each user has viewed
-- Users can only view profiles up to their subscription's views_limit

-- Drop existing objects first
DROP TRIGGER IF EXISTS trigger_prevent_duplicate_profile_views ON profile_views;
DROP FUNCTION IF EXISTS prevent_duplicate_profile_views();
DROP FUNCTION IF EXISTS get_user_remaining_views(UUID);
DROP FUNCTION IF EXISTS can_user_view_more_profiles(UUID);
DROP POLICY IF EXISTS "Admins can view all profile views" ON profile_views;
DROP POLICY IF EXISTS "Users can insert their own profile views" ON profile_views;
DROP POLICY IF EXISTS "Users can view their own profile views" ON profile_views;
DROP TABLE IF EXISTS profile_views;

-- Step 1: Create profile_views table
CREATE TABLE IF NOT EXISTS profile_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    viewer_user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    viewed_profile_user_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure a user can't view the same profile multiple times (unique constraint)
    UNIQUE(viewer_user_id, viewed_profile_user_id),
    
    -- Ensure a user can't view their own profile
    CHECK (viewer_user_id != viewed_profile_user_id)
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer_user_id ON profile_views(viewer_user_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_profile_user_id ON profile_views(viewed_profile_user_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_at ON profile_views(viewed_at);

-- Step 3: Enable Row Level Security (RLS)
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies

-- Policy 1: Users can only see their own view history
CREATE POLICY "Users can view their own profile views" ON profile_views
    FOR SELECT
    USING (viewer_user_id = auth.uid());

-- Policy 2: Users can insert their own profile views (with total limit check)
CREATE POLICY "Users can insert their own profile views" ON profile_views
    FOR INSERT
    WITH CHECK (
        viewer_user_id = auth.uid() AND
        -- Check if user hasn't exceeded their views limit
        (
            SELECT COUNT(*) 
            FROM profile_views pv 
            WHERE pv.viewer_user_id = auth.uid()
        ) < (
            SELECT us.views_limit
            FROM user_subscriptions us 
            WHERE us.user_id = auth.uid()
            LIMIT 1
        ) AND
         -- Ensure user has a subscription record with views_limit
         EXISTS (
             SELECT 1 
             FROM user_subscriptions us 
             WHERE us.user_id = auth.uid() AND us.views_limit IS NOT NULL
         )
    );

-- Policy 3: Admins can view all profile views (temporarily disabled to fix infinite recursion)
-- CREATE POLICY "Admins can view all profile views" ON profile_views
--     FOR ALL
--     USING (
--         EXISTS (
--             SELECT 1 FROM admin_users au 
--             WHERE au.user_id = auth.uid() AND au.role = 'admin'
--         )
--     );

-- Step 5: Add views_limit column to user_subscriptions table if it doesn't exist
-- This column will store how many profiles a user can view per month based on their subscription
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_subscriptions' AND column_name = 'views_limit'
    ) THEN
        ALTER TABLE user_subscriptions ADD COLUMN views_limit INTEGER DEFAULT 5;
        
        -- Update views_limit based on subscription status
        UPDATE user_subscriptions SET views_limit = CASE
            WHEN subscription_status = 'free' THEN 5
            WHEN subscription_status = 'premium_lite' THEN 20  -- 15 + 5 free
            WHEN subscription_status = 'premium_classic' THEN 30  -- 25 + 5 free
            WHEN subscription_status = 'premium_plus' THEN 60  -- 55 + 5 free
            WHEN subscription_status = 'humsafar_select' THEN 999999  -- Unlimited
            ELSE 5
        END;
        
        RAISE NOTICE 'Added views_limit column to user_subscriptions table';
    ELSE
        RAISE NOTICE 'views_limit column already exists in user_subscriptions table';
    END IF;
END $$;

-- Step 6: Create helper functions

-- Function to check if user can view more profiles (total limit)
CREATE OR REPLACE FUNCTION can_user_view_more_profiles(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE

    total_views INTEGER;
    user_views_limit INTEGER;
BEGIN
    -- Get user's total views
    SELECT COUNT(*) INTO total_views
    FROM profile_views pv
    WHERE pv.viewer_user_id = p_user_id;
    
    -- Get user's views limit from user_subscriptions table only
    SELECT us.views_limit INTO user_views_limit
    FROM user_subscriptions us
    WHERE us.user_id = p_user_id
    LIMIT 1;
    
    -- If no subscription record found, return false
    IF user_views_limit IS NULL THEN
        RETURN false;
    END IF;
    
    -- Return true if user can view more profiles
    RETURN total_views < user_views_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's remaining views (total limit)
CREATE OR REPLACE FUNCTION get_user_remaining_views(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total_views INTEGER;
    user_views_limit INTEGER;
BEGIN
    -- Get user's total views
    SELECT COUNT(*) INTO total_views
    FROM profile_views pv
    WHERE pv.viewer_user_id = p_user_id;
    
    -- Get user's views limit from user_subscriptions table only
    SELECT us.views_limit INTO user_views_limit
    FROM user_subscriptions us
    WHERE us.user_id = p_user_id
    LIMIT 1;
    
    -- If no subscription record found, return 0 remaining views
    IF user_views_limit IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Return remaining views
    RETURN GREATEST(0, user_views_limit - total_views);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Create trigger to prevent viewing same profile multiple times
CREATE OR REPLACE FUNCTION prevent_duplicate_profile_views()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if this view already exists
    IF EXISTS (
        SELECT 1 FROM profile_views 
        WHERE viewer_user_id = NEW.viewer_user_id 
        AND viewed_profile_user_id = NEW.viewed_profile_user_id
    ) THEN
        RAISE EXCEPTION 'Profile already viewed by this user';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_duplicate_profile_views
    BEFORE INSERT ON profile_views
    FOR EACH ROW
    EXECUTE FUNCTION prevent_duplicate_profile_views();

-- Step 8: Verification queries

-- Check if table was created successfully
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profile_views';

-- Check if views_limit column was added to user_subscriptions
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'user_subscriptions' AND column_name = 'views_limit';

-- Test the functions
SELECT can_user_view_more_profiles('some-user-id');
SELECT get_user_remaining_views('some-user-id');

-- Usage Examples:
/*
-- Record a profile view
INSERT INTO profile_views (viewer_user_id, viewed_profile_user_id) 
VALUES ('viewer-user-id', 'viewed-user-id');

-- Check user's total view count
SELECT COUNT(*) as total_views
FROM profile_views 
WHERE viewer_user_id = 'user-id';

-- Get user's remaining views
SELECT get_user_remaining_views('user-id') as remaining_views;

-- To get user's view statistics:
SELECT 
    us.subscription_status,
    us.views_limit,
    COUNT(pv.id) as total_views,
    get_user_remaining_views(us.user_id) as remaining_views
FROM user_subscriptions us
LEFT JOIN profile_views pv ON pv.viewer_user_id = us.user_id
WHERE us.user_id = 'user-id-here'
GROUP BY us.user_id, us.subscription_status, us.views_limit;
*/