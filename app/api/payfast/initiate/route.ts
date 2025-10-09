import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabase as supabaseAnonClient } from '@/lib/supabaseClient'

// Service role client for server-side writes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Basic initiate handler that would request a PayFast session/token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { packageId, amount, views_limit, user_id } = body || {}

    if (!packageId || typeof amount !== 'number' || !views_limit) {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
    }

    const merchantId = process.env.PAYFAST_MERCHANT_ID
    const securedKey = process.env.PAYFAST_SECURED_KEY
    const siteUrlEnv = process.env.NEXT_PUBLIC_SITE_URL
    let siteUrl = siteUrlEnv
    // Fallback to request host for local/dev preview when NEXT_PUBLIC_SITE_URL isn't set
    if (!siteUrl) {
      const host = request.headers.get('host') || 'localhost:3000'
      const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1')
      siteUrl = `${isLocalhost ? 'http' : 'https'}://${host}`
    }

    // Get current user from Supabase JWT in cookies (if available)
    // Fallback: require auth context via anon client passed with header in future
    // For now, infer user via service role is not possible; we will select from auth cookie
    const authHeader = request.headers.get('authorization')
    let userId: string | null = user_id || null
    try {
      // Use anon client to read current user
      const anon = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { data: { user } } = await anon.auth.getUser()
      userId = userId || user?.id || null
    } catch {}

    // Prepare order/session record (pending) for tracking before redirect
    // Try inserting with service role first, fall back to anon client if service key invalid/missing
    let sessionRecord: any = null
    const { data: srData, error: insertError } = await supabaseAdmin
      .from('payments')
      .insert({
        user_id: userId, // front-end ensures user is logged in
        payment_method: 'payfast',
        payment_status: 'pending',
        package_type: packageId,
        amount,
        views_limit,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      const errMsg = (insertError as any)?.message || ''
      const looksLikeBadKey = errMsg.toLowerCase().includes('invalid api key')
      // Attempt anon client insert if service role key is invalid/missing
      if (looksLikeBadKey) {
        const { data: anonData, error: anonError } = await supabaseAnonClient
          .from('payments')
          .insert({
            user_id: userId,
            payment_method: 'payfast',
            payment_status: 'pending',
            package_type: packageId,
            amount,
            views_limit,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (anonError) {
          // Return user-friendly error without exposing internal key issues
          return NextResponse.json(
            { error: 'Service configuration error. Please upload a payment screenshot or try again later.' },
            { status: 500 }
          )
        }
        sessionRecord = anonData
      } else {
        // Other DB errors
        return NextResponse.json(
          { error: `Failed to create payment session: ${errMsg || 'Unknown database error'}` },
          { status: 500 }
        )
      }
    } else {
      sessionRecord = srData
    }

    // In a real integration, call PayFast to create a transaction session and get redirect URL
    // For now, construct a placeholder redirect to a local success page simulating checkout
    // Replace with PayFast API call when credentials are available.
    // Redirect back to dashboard without success flag; activation happens only after actual acceptance
    const redirectUrl = `${siteUrl}/dashboard?method=payfast&pid=${encodeURIComponent(sessionRecord.id)}`

    return NextResponse.json({ redirect_url: redirectUrl })
  } catch (err: any) {
    console.error('PayFast initiate error:', err)
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}