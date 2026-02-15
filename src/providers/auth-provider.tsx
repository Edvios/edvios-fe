'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Update token in sessionStorage whenever it changes
        if (session?.access_token) {
          sessionStorage.setItem('auth-token', session.access_token);
        } else {
          // Clear session if no token
          sessionStorage.removeItem('auth-token');
          sessionStorage.removeItem('user-session');
        }

        // Handle specific events
        if (event === 'SIGNED_OUT') {
          sessionStorage.removeItem('auth-token');
          sessionStorage.removeItem('user-session');
          router.push('/auth/login');
        } else if (event === 'TOKEN_REFRESHED') {
          // Token refreshed successfully
        } else if (event === 'USER_UPDATED') {
          // User updated
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return <>{children}</>;
}
