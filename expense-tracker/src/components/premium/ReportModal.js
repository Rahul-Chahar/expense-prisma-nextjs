'use client';

import { useState, useEffect } from 'react';
import { formatAmount } from '@/lib/formatters';

export default function ReportModal({ isOpen, onClose, isPremiumUser }) {
  const [reportType, setReportType] = useState('monthly');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (isOpen && isPremiumUser) {
      loadReport();
      loadDownloadHistory();
    }
  }, [isOpen, isPremiumUser, reportType]);

  const loadReport = async () => {
    if (!isPremiumUser) return;
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses/report/${reportType}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      if (!response.ok) {
        throw new Error('Error loading report');
      }
      
      const data = await response.json();
      setTransactions(data.transactions || []);
      
      // Calculate totals
      let income = 0;
      let expense = 0;
      
      data.transactions.forEach(transaction => {
        if (transaction.type === 'income') {
          income += parseFloat(transaction.amount);
        } else {
          expense += parseFloat(transaction.amount);
        }
      });
      
      setTotalIncome(income);
      setTotalExpense(expense);
    } catch (error) {
      console.error('Error loading report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDownloadHistory = async () => {
    if (!isPremiumUser) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses/download-history`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      if (!response.ok) {
        throw new Error('Error loading download history');
      }
      
      const data = await response.json();
      setDownloadHistory(data.history || []);
    } catch (error) {
      console.error('Error loading download history:', error);
    }
  };

  const handleDownload = async () => {
    if (!isPremiumUser) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/expenses/download?type=${reportType}`, {
        headers: { 
          Authorization: `Bearer ${token}` 
        }
      });
      
      if (!response.ok) {
        throw new Error('Error downloading report');
      }
      
      const data = await response.json();
      
      if (data.fileUrl) {
        window.open(data.fileUrl, '_blank');
        loadDownloadHistory();
      } else {
        throw new Error('File URL not found in response');
      }
    } catch (error) {
      console.error('Error downloading report:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-6 border-2 border-slate-300 w-11/12 max-w-5xl shadow-2xl rounded-lg bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">Financial Reports</h2>
          <button 
            onClick={onClose} 
            className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 p-2 rounded-full transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-col">
            <label htmlFor="reportType" className="text-sm font-medium text-slate-700 mb-2">
              Report Type
            </label>
            <select 
              id="reportType" 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border-2 border-slate-300 rounded-lg p-3 bg-white text-slate-800 font-medium focus:border-blue-500 focus:outline-none min-w-[200px]"
            >
              <option value="daily">Daily Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="yearly">Yearly Report</option>
            </select>
          </div>
          
          <button 
            onClick={handleDownload}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            📥 Download Report
          </button>
        </div>
        
        {/* Download History Toggle */}
        <div className="mb-4">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
          >
            {showHistory ? '🔼 Hide Download History' : '🔽 Show Download History'}
          </button>
        </div>
        
        {/* Download History */}
        {showHistory && (
          <div className="mb-6 bg-slate-50 rounded-lg p-4 border border-slate-200">
            <h3 className="text-lg font-bold mb-3 text-slate-800">Download History</h3>
            <div className="space-y-3">
              {downloadHistory.length === 0 ? (
                <p className="text-slate-600 italic">No download history available</p>
              ) : (
                downloadHistory.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <p className="text-sm text-slate-600 mb-2">
                      <strong>Downloaded:</strong> {new Date(item.downloadedAt).toLocaleString()}
                    </p>
                    <a 
                      href={item.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      📄 Download File
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-700 font-medium">Loading report data...</p>
          </div>
        ) : (
          /* Report Table */
          <div className="bg-white rounded-lg border-2 border-slate-300 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Table Header */}
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="px-4 py-4 text-left font-bold text-sm uppercase tracking-wide">Date</th>
                    <th className="px-4 py-4 text-left font-bold text-sm uppercase tracking-wide">Description</th>
                    <th className="px-4 py-4 text-left font-bold text-sm uppercase tracking-wide">Category</th>
                    <th className="px-4 py-4 text-right font-bold text-sm uppercase tracking-wide">Income</th>
                    <th className="px-4 py-4 text-right font-bold text-sm uppercase tracking-wide">Expense</th>
                  </tr>
                </thead>
                
                {/* Table Body */}
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-slate-600 bg-slate-50 font-medium">
                        📊 No transactions found for this period
                      </td>
                    </tr>
                  ) : (
                    transactions.map((transaction, index) => (
                      <tr 
                        key={index} 
                        className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                        }`}
                      >
                        <td className="px-4 py-3 text-slate-800 font-medium">
                          {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-3 text-slate-800 font-medium">{transaction.description}</td>
                        <td className="px-4 py-3 text-slate-700">
                          <span className="bg-slate-100 px-2 py-1 rounded-full text-xs font-medium">
                            {transaction.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold">
                          {transaction.type === 'income' ? (
                            <span className="text-green-700">💰 {formatAmount(transaction.amount)}</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-bold">
                          {transaction.type === 'expense' ? (
                            <span className="text-red-700">💸 {formatAmount(transaction.amount)}</span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                
                {/* Table Footer - Totals */}
                <tfoot>
                  <tr className="bg-slate-100 border-t-2 border-slate-300">
                    <td colSpan="3" className="px-4 py-4 text-slate-800 font-bold text-lg">
                      📈 TOTALS
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-lg text-green-700">
                      💰 {formatAmount(totalIncome)}
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-lg text-red-700">
                      💸 {formatAmount(totalExpense)}
                    </td>
                  </tr>
                  <tr className="bg-blue-100 border-t border-slate-300">
                    <td colSpan="4" className="px-4 py-4 text-slate-800 font-bold text-lg">
                      💎 NET SAVINGS
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-xl">
                      <span className={`${totalIncome - totalExpense >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                        {totalIncome - totalExpense >= 0 ? '📈' : '📉'} {formatAmount(totalIncome - totalExpense)}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}