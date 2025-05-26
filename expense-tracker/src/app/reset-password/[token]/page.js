'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { ThemeProvider } from '@/context/ThemeContext';

export default function ResetPasswordPage({ params }) {
  const router = useRouter();
  const { token } = params;
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Verify token on page load
    const verifyToken = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/password/resetpassword/${token}`);  
        if (response.ok) {
          setIsValidToken(true);
        } else {
          // Invalid token, redirect to login after a delay
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        // Invalid token, redirect to login after a delay
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [token, router]);

  return (
    <ThemeProvider>
      <div className="bg-background-alt min-h-screen flex items-center justify-center">
        {isLoading ? (
          <div className="text-center p-8 bg-background rounded-lg shadow-lg">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-foreground">Verifying reset link...</p>
          </div>
        ) : isValidToken ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className="text-center p-8 bg-background rounded-lg shadow-lg">
            <div className="text-error text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-foreground mb-2">Invalid or Expired Link</h2>
            <p className="text-foreground-alt mb-4">This password reset link is invalid or has expired.</p>
            <p className="text-foreground-alt">Redirecting to login page...</p>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}
