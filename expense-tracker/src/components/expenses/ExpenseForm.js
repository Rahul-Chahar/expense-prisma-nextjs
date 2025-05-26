'use client';

import { useState, useRef, useEffect } from 'react';

export default function ExpenseForm({ onExpenseAdded }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Search functionality states
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const categories = [
    { value: "Salary", label: "💰 Salary" },
    { value: "Food", label: "🍛 Food" },
    { value: "Petrol", label: "⛽ Petrol" },
    { value: "Groceries", label: "🛒 Groceries" },
    { value: "Transportation", label: "🚗 Transportation" },
    { value: "Entertainment", label: "🎭 Entertainment" },
    { value: "Shopping", label: "🛍️ Shopping" },
    { value: "Bills", label: "📱 Bills & Recharge" },
    { value: "Health", label: "💊 Health" },
    { value: "Education", label: "📚 Education" },
    { value: "Other", label: "📦 Other" }
  ];

  const filteredCategories = categories.filter(cat =>
    cat.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCategory = categories.find(cat => cat.value === category);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      const response = await fetch(`http://localhost:8080/api/expenses/add`, {
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
        <div className={`${isOpen ? 'mb-64' : ''}`}>
          <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">Category</label>
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="input-field w-full text-left flex justify-between items-center"
            >
              <span>{selectedCategory ? selectedCategory.label : 'Select category'}</span>
              <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            
            {isOpen && (
              <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded shadow-lg">
                <div className="p-2 border-b border-border">
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded text-sm bg-background text-foreground placeholder-foreground-alt focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => {
                        setCategory(cat.value);
                        setIsOpen(false);
                        setSearchTerm('');
                      }}
                      className={`w-full px-3 py-2 text-left text-foreground hover:bg-hover transition-colors ${
                        category === cat.value ? 'bg-primary bg-opacity-10 text-primary' : ''
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                  {filteredCategories.length === 0 && (
                    <div className="px-3 py-2 text-foreground-alt text-sm">No categories found</div>
                  )}
                </div>
              </div>
            )}
          </div>
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