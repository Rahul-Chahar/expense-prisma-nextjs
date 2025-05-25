'use client';

import { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export default function ExpenseItem({ expense, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const expenseId = expense.id || expense._id;
      
      // Use the onDelete prop which should come from the ExpenseContext
      if (onDelete) {
        const result = await onDelete(expenseId);
        
        if (result && result.success) {
          setShowDeleteModal(false);
        } else if (result && result.error) {
          throw new Error(result.error);
        } else {
          // If onDelete doesn't return a result object, assume success
          setShowDeleteModal(false);
        }
      } else {
        throw new Error('Delete function not provided');
      }
      
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Delete error: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showDeleteModal) {
        setShowDeleteModal(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showDeleteModal]);
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-100">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="font-medium text-gray-900">{expense.description}</p>
            <p className="text-sm text-gray-600">{expense.category}</p>
            <p className="text-xs text-gray-500">{new Date(expense.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`font-semibold ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {expense.type === 'income' ? '+' : '-'}{formatAmount(expense.amount)}
            </span>
            <button 
              onClick={handleDeleteClick} 
              disabled={isDeleting}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50"
              aria-label="Delete expense"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-200 scale-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 rounded-full p-2">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Expense</h3>
              </div>
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this expense? This action cannot be undone.
              </p>
              
              {/* Expense Preview */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    <p className="text-sm text-gray-600">{expense.category}</p>
                  </div>
                  <span className={`font-semibold ${expense.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {expense.type === 'income' ? '+' : '-'}{formatAmount(expense.amount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-3 p-6 border-t border-gray-100">
              <button
                onClick={handleCancelDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}