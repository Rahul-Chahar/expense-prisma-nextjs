'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Load saved preference for items per page
    const savedItemsPerPage = localStorage.getItem('itemsPerPage');
    if (savedItemsPerPage) {
      setItemsPerPage(parseInt(savedItemsPerPage, 10));
    }

    // Check if user is authenticated before loading expenses
    checkAuthAndLoadExpenses();
  }, []);

  const checkAuthAndLoadExpenses = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      // Don't set error here, just silently handle unauthenticated state
      return;
    }

    // Verify token is still valid by making a test request
    try {
      const testResponse = await fetch('http://localhost:8080/api/expenses/user', {
        method: 'HEAD', // Just check if we can access the endpoint
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (testResponse.ok) {
        setIsAuthenticated(true);
        loadExpenses();
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const loadExpenses = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setError('Please log in to view your expenses');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/expenses/user', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token expired or invalid
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          throw new Error('Session expired. Please log in again.');
        }
        
        const errText = await response.text();
        throw new Error(`Failed to load expenses: ${errText || response.statusText}`);
      }

      const data = await response.json();

      if (!data || !data.expenses) {
        throw new Error('Invalid response format: Missing expenses array');
      }

      // Sort by createdAt descending
      const sortedExpenses = [...data.expenses].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setExpenses(sortedExpenses);
      setTotalExpenses(sortedExpenses.length);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async (expenseData) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Please log in to add expenses');
      return { success: false, error: 'Authentication required' };
    }

    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/expenses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseData),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          throw new Error('Session expired. Please log in again.');
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error adding expense');
      }

      // Reload expenses after successful add
      await loadExpenses();
      return { success: true };
    } catch (error) {
      console.error('Error adding expense:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const deleteExpense = async (expenseId) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Please log in to delete expenses');
      return { success: false, error: 'Authentication required' };
    }

    setError(null);

    try {
      const response = await fetch(`http://localhost:8080/api/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          throw new Error('Session expired. Please log in again.');
        }
        
        const errorText = await response.text();
        throw new Error(`Error deleting expense: ${errorText || response.statusText}`);
      }

      setExpenses((prevExpenses) => {
        const updated = prevExpenses.filter(
          (expense) =>
            String(expense.id) !== String(expenseId) && String(expense._id) !== String(expenseId)
        );
        setTotalExpenses(updated.length);
        return updated;
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError(error.message);
      return { success: false, error: error.message };
    }
  };

  const updateItemsPerPage = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    localStorage.setItem('itemsPerPage', newItemsPerPage);
  };

  const getPaginatedExpenses = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return expenses.slice(startIndex, endIndex);
  };

  // Method to manually trigger expense loading (useful for login callbacks)
  const refreshExpenses = () => {
    checkAuthAndLoadExpenses();
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        isLoading,
        error,
        currentPage,
        itemsPerPage,
        totalExpenses,
        isAuthenticated,
        setCurrentPage,
        loadExpenses,
        addExpense,
        deleteExpense,
        updateItemsPerPage,
        getPaginatedExpenses,
        refreshExpenses,
        clearError,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}