'use client';

import { useState } from 'react';

export default function ExpenseForm({ onExpenseAdded }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const data = {
        amount: parseFloat(amount),
        type,
        description: description.trim(),
        category
      };

      if (isNaN(data.amount) || data.amount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      const response = await fetch('http://localhost:8080/api/expenses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error adding expense');
      }

      // Reset form
      setAmount('');
      setType('expense');
      setDescription('');
      setCategory('Food');

      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-foreground mb-6">Add New Expenses</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-1">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-alt">₹</span>
            <input 
              type="number" 
              id="amount" 
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required 
              className="input-field pl-8"
            />
          </div>
          {/* Form Error Display */}
          {errorMessage && <div className="text-error text-sm mt-1">{errorMessage}</div>}
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-foreground mb-1">Type</label>
          <select 
            id="type" 
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required 
            className="input-field"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">Description</label>
          <input 
            type="text" 
            id="description" 
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required 
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">Category</label>
          <select 
            id="category" 
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required 
            className="input-field"
          >
            <option value="Salary">💰 Salary</option>
            <option value="Food">🍛 Food</option>
            <option value="Petrol">⛽ Petrol</option>
            <option value="Groceries">🛒 Groceries</option>
            <option value="Transportation">🚗 Transportation</option>
            <option value="Entertainment">🎭 Entertainment</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Bills">📱 Bills & Recharge</option>
            <option value="Health">💊 Health</option>
            <option value="Education">📚 Education</option>
            <option value="Other">📦 Other</option>
          </select>
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? 'Adding...' : 'Add Expenses'}
        </button>
      </form>
    </div>
  );
}
