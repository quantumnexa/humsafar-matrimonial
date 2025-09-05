-- Sample data creation script for testing viewed profiles functionality

-- First, let's create some sample user profiles
-- Note: These are sample UUIDs for testing purposes

-- Insert sample user profiles
INSERT INTO user_profiles (
    user_id,
    email,
    first_name,
    last_name,
    phone,
    gender,
    date_of_birth,
    age,
    city,
    education,
    field_of_study,
    religion,
    marital_status,
    bio,
    verified,
    created_at,
    updated_at
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'john.doe@example.com',
    'John',
    'Doe',
    '+1234567890',
    'male',
    '1990-05-15',
    34,
    'New York',
    'Bachelor of Engineering',
    'Computer Science',
    'Christian',
    'single',
    'Software engineer with passion for technology',
    true,
    NOW(),
    NOW()
),
(
    '22222222-2222-2222-2222-222222222222',
    'jane.smith@example.com',
    'Jane',
    'Smith',
    '+1234567891',
    'female',
    '1992-08-20',
    32,
    'Los Angeles',
    'Master of Business Administration',
    'Marketing',
    'Hindu',
    'single',
    'Marketing professional with creative mindset',
    true,
    NOW(),
    NOW()
),
(
    '33333333-3333-3333-3333-333333333333',
    'ahmed.ali@example.com',
    'Ahmed',
    'Ali',
    '+1234567892',
    'male',
    '1988-12-10',
    36,
    'Chicago',
    'Master of Science',
    'Data Science',
    'Muslim',
    'single',
    'Data scientist working in healthcare',
    false,
    NOW(),
    NOW()
),
(
    '44444444-4444-4444-4444-444444444444',
    'priya.sharma@example.com',
    'Priya',
    'Sharma',
    '+1234567893',
    'female',
    '1994-03-25',
    30,
    'San Francisco',
    'Bachelor of Arts',
    'Psychology',
    'Hindu',
    'single',
    'Clinical psychologist helping people',
    true,
    NOW(),
    NOW()
),
(
    '55555555-5555-5555-5555-555555555555',
    'michael.brown@example.com',
    'Michael',
    'Brown',
    '+1234567894',
    'male',
    '1991-07-08',
    33,
    'Boston',
    'Doctor of Medicine',
    'Cardiology',
    'Christian',
    'single',
    'Cardiologist dedicated to saving lives',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (user_id) DO NOTHING;

-- Create user subscriptions for these sample users
INSERT INTO user_subscriptions (
    user_id,
    subscription_status,
    profile_status,
    views_limit,
    created_at,
    updated_at
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    'premium_lite',
    'approved',
    20,
    NOW(),
    NOW()
),
(
    '22222222-2222-2222-2222-222222222222',
    'free',
    'approved',
    5,
    NOW(),
    NOW()
),
(
    '33333333-3333-3333-3333-333333333333',
    'premium_classic',
    'approved',
    30,
    NOW(),
    NOW()
),
(
    '44444444-4444-4444-4444-444444444444',
    'free',
    'approved',
    5,
    NOW(),
    NOW()
),
(
    '55555555-5555-5555-5555-555555555555',
    'premium_plus',
    'approved',
    60,
    NOW(),
    NOW()
)
ON CONFLICT (user_id) DO NOTHING;

-- Create some sample profile views
-- Let's assume user 11111111-1111-1111-1111-111111111111 (John) has viewed some profiles
INSERT INTO profile_views (
    viewer_user_id,
    viewed_profile_user_id,
    viewed_at,
    created_at
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
),
(
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
),
(
    '11111111-1111-1111-1111-111111111111',
    '44444444-4444-4444-4444-444444444444',
    NOW() - INTERVAL '3 hours',
    NOW() - INTERVAL '3 hours'
)
ON CONFLICT (viewer_user_id, viewed_profile_user_id) DO NOTHING;

-- Create some sample user images
INSERT INTO user_images (
    user_id,
    image_url,
    is_main,
    created_at,
    updated_at
) VALUES 
(
    '11111111-1111-1111-1111-111111111111',
    '/placeholder.svg?height=300&width=400',
    true,
    NOW(),
    NOW()
),
(
    '22222222-2222-2222-2222-222222222222',
    '/placeholder.svg?height=300&width=400',
    true,
    NOW(),
    NOW()
),
(
    '33333333-3333-3333-3333-333333333333',
    '/placeholder.svg?height=300&width=400',
    true,
    NOW(),
    NOW()
),
(
    '44444444-4444-4444-4444-444444444444',
    '/placeholder.svg?height=300&width=400',
    true,
    NOW(),
    NOW()
),
(
    '55555555-5555-5555-5555-555555555555',
    '/placeholder.svg?height=300&width=400',
    true,
    NOW(),
    NOW()
)
ON CONFLICT (user_id, is_main) DO NOTHING;

-- Verification queries
SELECT 'User Profiles Created:' as info, COUNT(*) as count FROM user_profiles;
SELECT 'User Subscriptions Created:' as info, COUNT(*) as count FROM user_subscriptions;
SELECT 'Profile Views Created:' as info, COUNT(*) as count FROM profile_views;
SELECT 'User Images Created:' as info, COUNT(*) as count FROM user_images;

-- Show sample data
SELECT 
    up.first_name,
    up.last_name,
    up.city,
    up.education,
    us.subscription_status,
    us.views_limit
FROM user_profiles up
JOIN user_subscriptions us ON up.user_id = us.user_id
LIMIT 5;

-- Show profile views
SELECT 
    viewer.first_name as viewer_name,
    viewed.first_name as viewed_name,
    pv.viewed_at
FROM profile_views pv
JOIN user_profiles viewer ON pv.viewer_user_id = viewer.user_id
JOIN user_profiles viewed ON pv.viewed_profile_user_id = viewed.user_id
ORDER BY pv.viewed_at DESC;