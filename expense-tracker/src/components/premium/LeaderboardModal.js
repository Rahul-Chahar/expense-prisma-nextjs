'use client';

import { useState, useEffect } from 'react';
import { Trophy, X, RefreshCw } from 'lucide-react';

export default function LeaderboardModal({ isOpen, onClose }) {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboardData();
    }
  }, [isOpen]);

  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/premium/leaderboard', {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      if (!response.ok) {
        throw new Error('Error fetching leaderboard');
      }
      
      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `${index + 1}.`;
    }
  };

  const getRankColors = (index) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 1:
        return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Trophy size={28} className="text-yellow-300" />
              <h2 className="text-2xl font-bold">Expense Leaderboard</h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              aria-label="Close leaderboard modal"
            >
              <X size={24} />
            </button>
          </div>
          <p className="mt-2 text-purple-100 text-sm">See who's managing their expenses best!</p>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading leaderboard...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-red-600 dark:text-red-400 font-medium">Failed to load leaderboard</p>
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
              </div>
              <button 
                onClick={fetchLeaderboardData}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <RefreshCw size={16} />
                <span>Try Again</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboardData.length === 0 ? (
                <div className="text-center py-8">
                  <Trophy size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No leaderboard data available</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Be the first to track your expenses!</p>
                </div>
              ) : (
                <>
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {leaderboardData.map((user, index) => (
                      <div key={index} className={`rounded-lg p-4 border transition-all hover:shadow-md ${
                        index < 3 
                          ? 'border-transparent shadow-sm' 
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                      } ${getRankColors(index)}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20 font-bold text-lg">
                              {getRankIcon(index)}
                            </div>
                            <div>
                              <span className="font-semibold text-lg">
                                {user.name || "Anonymous User"}
                              </span>
                              {index < 3 && (
                                <div className="text-sm opacity-90">
                                  {index === 0 ? 'Top Spender	!' : index === 1 ? 'Heavy Spender	!' : 'Active Spender!'}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xl">
                              {new Intl.NumberFormat("en-IN", {
                                style: "currency",
                                currency: "INR",
                                maximumFractionDigits: 0
                              }).format(user.totalExpenses)}
                            </div>
                            <div className="text-sm opacity-75">
                              Total Expenses
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats Summary */}
                  <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total Users: <span className="font-semibold text-gray-800 dark:text-gray-200">{leaderboardData.length}</span>
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <button 
            onClick={onClose} 
            className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}