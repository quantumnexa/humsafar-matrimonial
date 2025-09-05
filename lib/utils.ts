import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateAge(dateOfBirth: string | Date): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Check if a user is an admin
 * @param userId - The user ID to check
 * @returns Promise<boolean> - True if user is admin, false otherwise
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { supabase } = await import('./supabaseClient')
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single()
    
    return !!adminUser
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Check if current authenticated user is an admin
 * @returns Promise<boolean> - True if current user is admin, false otherwise
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const { supabase } = await import('./supabaseClient')
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return false
    
    return await isUserAdmin(user.id)
  } catch (error) {
    console.error('Error checking current user admin status:', error)
    return false
  }
}
