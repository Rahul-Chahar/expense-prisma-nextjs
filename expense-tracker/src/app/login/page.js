'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import { ThemeProvider } from '@/context/ThemeContext';

export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/expenses');
    }
  }, [router]);

  return (
    <ThemeProvider>
      <div className="bg-background-alt min-h-screen flex items-center justify-center">
        <LoginForm />
      </div>
    </ThemeProvider>
  );
}
