'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error logging in. Please try again.');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        setSuccessMessage('Login successful! Redirecting...');
        
        setTimeout(() => {
          window.location.href = '/expenses';
        }, 1000);
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/password/forgotpassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error sending reset link');
      }

      setSuccessMessage('Password reset link sent to your email!');
      setShowForgotPassword(false);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <div className="bg-background p-8 rounded-lg shadow-lg max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">💰 Expense Tracker</h1>
          <p className="text-foreground-alt mt-2">Welcome back! Please login to your account.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
              placeholder="Enter your password"
            />
          </div>

          {/* Error/Success Messages */}
          {errorMessage && <p className="text-error text-sm">{errorMessage}</p>}
          {successMessage && <p className="text-success text-sm">{successMessage}</p>}

          {/* Login Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="btn-secondary w-full"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <button 
            onClick={() => setShowForgotPassword(true)}
            className="text-secondary hover:text-blue-700 text-sm"
          >
            Forgot Password?
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-foreground-alt">
            Don't have an account?
            <Link href="/signup" className="text-secondary hover:text-blue-700 font-medium ml-1">
              Sign up now
            </Link>
          </p>
        </div>

        {/* Features Section */}
        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-center text-foreground-alt font-medium mb-4">Why use Expense Tracker?</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3">
              <div className="text-secondary text-xl mb-2">📊</div>
              <h4 className="text-sm font-medium text-foreground">Track Expenses</h4>
              <p className="text-xs text-foreground-alt">Monitor your daily spending</p>
            </div>
            <div className="text-center p-3">
              <div className="text-secondary text-xl mb-2">📈</div>
              <h4 className="text-sm font-medium text-foreground">Analyze Data</h4>
              <p className="text-xs text-foreground-alt">Get insights on spending</p>
            </div>
            <div className="text-center p-3">
              <div className="text-secondary text-xl mb-2">💰</div>
              <h4 className="text-sm font-medium text-foreground">Save Money</h4>
              <p className="text-xs text-foreground-alt">Achieve financial goals</p>
            </div>
            <div className="text-center p-3">
              <div className="text-secondary text-xl mb-2">🔒</div>
              <h4 className="text-sm font-medium text-foreground">Secure Data</h4>
              <p className="text-xs text-foreground-alt">Your data is protected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-foreground">Reset Password</h2>
              <button onClick={() => setShowForgotPassword(false)} className="text-foreground-alt hover:text-foreground">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <p className="text-foreground-alt mb-4">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-foreground mb-1">
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="reset-email" 
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>
              <button 
                type="submit"
                disabled={resetLoading}
                className="btn-secondary w-full"
              >
                {resetLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
