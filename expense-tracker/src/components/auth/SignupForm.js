'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupForm() {
  const [name, setName] = useState('');
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
      const response = await fetch(`http://localhost:8080/api/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred!');
      }

      setSuccessMessage('Account created successfully! Redirecting to login...');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background p-8 rounded-lg shadow-lg max-w-md w-full">
      {/* Header/Brand */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">💰 Expense Tracker</h1>
        <p className="text-foreground-alt mt-2">Create your account to start tracking expenses</p>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Full Name
          </label>
          <input 
            type="text" 
            id="name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
            placeholder="Enter your full name"
          />
        </div>

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
            placeholder="Create a strong password"
          />
        </div>

        {/* Error/Success Messages */}
        {errorMessage && <p className="text-error text-sm">{errorMessage}</p>}
        {successMessage && <p className="text-success text-sm">{successMessage}</p>}

        {/* Signup Button */}
        <button 
          type="submit"
          disabled={isLoading}
          className="btn-secondary w-full"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-foreground-alt">
          Already have an account?
          <Link href="/login" className="text-secondary hover:text-blue-700 font-medium ml-1">
            Login here
          </Link>
        </p>
      </div>

      {/* Features/Benefits Section */}
      <div className="mt-8 pt-8 border-t border-border">
        <h3 className="text-center text-foreground-alt font-medium mb-4">Benefits of joining</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-background-alt rounded-lg">
            <span className="text-2xl">📊</span>
            <div>
              <h4 className="text-sm font-medium text-foreground">Easy Expense Tracking</h4>
              <p className="text-xs text-foreground-alt">Track all your expenses in one place</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-background-alt rounded-lg">
            <span className="text-2xl">📈</span>
            <div>
              <h4 className="text-sm font-medium text-foreground">Smart Analytics</h4>
              <p className="text-xs text-foreground-alt">Get insights about your spending habits</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-background-alt rounded-lg">
            <span className="text-2xl">🔔</span>
            <div>
              <h4 className="text-sm font-medium text-foreground">Budget Alerts</h4>
              <p className="text-xs text-foreground-alt">Set budgets and get notifications</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
