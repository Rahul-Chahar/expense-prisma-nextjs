'use client';

import { useState, useEffect } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import ExpenseItem from './ExpenseItem';

export default function ExpenseList({ onDelete, itemsPerPage = 10 }) {
  const {
    expenses = [],
    isLoading,
    currentPage,
    setCurrentPage,
    itemsPerPage: contextItemsPerPage,
    updateItemsPerPage,
  } = useExpenses();

  const [perPage, setPerPage] = useState(itemsPerPage);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [isClient, setIsClient] = useState(false); // ✅ Add client-side flag

  // ✅ Fix: Handle client-side mounting first
  useEffect(() => {
    setIsClient(true);
    
    // Only access localStorage after client mount
    const storedPerPage = localStorage.getItem('itemsPerPage');
    if (storedPerPage) {
      setPerPage(parseInt(storedPerPage));
    }
  }, []);

  // Sync filteredExpenses with context data
  useEffect(() => {
    setFilteredExpenses(expenses || []);
  }, [expenses]);

  // ✅ Use consistent values during SSR
  const effectivePerPage = isClient ? perPage : itemsPerPage;
  
  // Pagination calculation
  const totalPages = Math.ceil(filteredExpenses.length / effectivePerPage);
  const startIndex = (currentPage - 1) * effectivePerPage;
  const endIndex = Math.min(startIndex + effectivePerPage, filteredExpenses.length);
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to page 1
    updateItemsPerPage(newPerPage);
    
    // ✅ Only save to localStorage on client
    if (typeof window !== 'undefined') {
      localStorage.setItem('itemsPerPage', newPerPage.toString());
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleDeleteExpense = (expenseId) => onDelete?.(expenseId);

  if (isLoading) {
    return <p className="text-center text-foreground-alt">Loading expenses...</p>;
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-foreground mb-4">Recent Expenses</h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="itemsPerPage" className="text-sm text-foreground-alt">Items per page:</label>
          <select
            id="itemsPerPage"
            value={effectivePerPage}
            onChange={handleItemsPerPageChange}
            className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="5" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">5</option>
            <option value="10" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">10</option>
            <option value="20" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">20</option>
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <p className="text-center text-foreground-alt">No expenses found</p>
        ) : (
          currentExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id || expense._id}
              expense={expense}
              onDelete={handleDeleteExpense}
            />
          ))
        )}
      </div>

      {filteredExpenses.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-foreground-alt">
            Showing {startIndex + 1} to {endIndex} of {filteredExpenses.length} Expenses
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded-lg transition-colors font-medium ${
                    page === currentPage
                      ? 'bg-primary text-white border-primary shadow-sm dark:bg-gray-800'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}