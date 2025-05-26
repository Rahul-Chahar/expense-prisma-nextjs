'use client';
import './globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { ExpenseProvider } from '@/context/ExpenseContext';

export default function RootLayout({ children }) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Only run auth logic after client mount
    const token = localStorage.getItem('token');
    const path = window.location.pathname;
    const isAuthPage = path === '/login' || path === '/signup' || path.startsWith('/reset-password');

    if (!token && !isAuthPage) {
      router.push('/login');
    }
  }, [router]);

  return (
    <html lang="en">
      <head />
      <body 
        // ✅ Fix: Suppress hydration warnings for body tag (browser extensions)
        suppressHydrationWarning={true}
      >
        {/* Razorpay Checkout Script */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />

        <ThemeProvider>
          <AuthProvider>
            <ExpenseProvider>
              {/* ✅ Only render children after client mount to prevent auth flicker */}
              {isClient ? children : (
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-lg">Loading...</div>
                </div>
              )}
            </ExpenseProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}