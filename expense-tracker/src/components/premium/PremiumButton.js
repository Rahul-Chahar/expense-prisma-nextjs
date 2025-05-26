'use client';

import { useState } from 'react';
import { Menu, X, Crown, Trophy, FileText, CreditCard } from 'lucide-react';

export default function PremiumSidebarDrawer({ isPremium, onBuyPremium, onShowLeaderboard, onShowReports }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyPremium = async () => {
    setIsLoading(true);
    try {
      await onBuyPremium();
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={toggleDrawer}
        className="fixed top-4 left-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeDrawer}
        />
      )}

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Premium Features</h2>
              <button
                onClick={closeDrawer}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            {isPremium && (
              <div className="mt-2 flex items-center space-x-2 text-yellow-200">
                <Crown size={20} />
                <span className="font-semibold">Premium Active</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-4">
            {isPremium ? (
              <>
                {/* Premium User Actions */}
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      onShowReports();
                      closeDrawer();
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors flex items-center space-x-3"
                  >
                    <FileText size={20} />
                    <div className="text-left">
                      <div className="font-semibold">View Reports</div>
                      <div className="text-sm opacity-90">Access detailed analytics</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onShowLeaderboard();
                      closeDrawer();
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg transition-colors flex items-center space-x-3"
                  >
                    <Trophy size={20} />
                    <div className="text-left">
                      <div className="font-semibold">Leaderboard</div>
                      <div className="text-sm opacity-90">See your ranking</div>
                    </div>
                  </button>
                </div>

                {/* Premium Benefits */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">Premium Benefits</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Unlimited access to reports</li>
                    <li>• Advanced analytics dashboard</li>
                    <li>• Exclusive leaderboard access</li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                {/* Upgrade to Premium */}
                <div className="text-center space-y-4">
                  <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg">
                    <Crown size={48} className="mx-auto text-purple-600 mb-3" />
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      Upgrade to Premium
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Unlock advanced features and get the most out of your experience
                    </p>
                  </div>

                  <button
                    onClick={handleBuyPremium}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        <span className="font-semibold">Buy Premium</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Features List */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3">What you will get:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <FileText size={18} className="text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-800">Detailed Reports</div>
                        <div className="text-sm text-gray-600">Comprehensive analytics and insights</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Trophy size={18} className="text-green-600" />
                      <div>
                        <div className="font-medium text-gray-800">Leaderboard Access</div>
                        <div className="text-sm text-gray-600">Track your progress and rankings</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Crown size={18} className="text-purple-600" />
                      <div>
                        <div className="font-medium text-gray-800">Premium Status</div>
                        <div className="text-sm text-gray-600">Exclusive member benefits</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500 text-center">
              Questions? Contact our support team for assistance. 
            </p>
          </div>
        </div>
      </div>
    </>
  );
}