'use client';

import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ isPremiumUser = false, showPremiumFeatures = false }) {
  const handleLogout = () => {
     {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  return (
    <nav className="bg-background border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h1 className="text-2xl font-bold text-foreground">Expense Tracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {showPremiumFeatures && (
              <>
                <button 
                  id="reportBtn" 
                  className={`${!isPremiumUser ? 'hidden' : ''} bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark`}
                >
                  View Reports
                </button>
                
                {isPremiumUser ? (
                  <>
                    <button 
                      id="leaderboardBtn"
                      className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      🏆 Leaderboard
                    </button>
                    <button 
                      className="bg-accent text-white px-4 py-2 rounded-lg cursor-default"
                    >
                      👑 Premium User
                    </button>
                  </>
                ) : (
                  <button 
                    id="buyPremiumBtn"
                    className="bg-accent hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    Buy Premium
                  </button>
                )}
              </>
            )}
            
            <button 
              onClick={handleLogout}
              className="bg-background-alt text-foreground px-4 py-2 rounded-lg hover:bg-border"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
