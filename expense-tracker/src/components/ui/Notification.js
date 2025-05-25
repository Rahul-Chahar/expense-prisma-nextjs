'use client';

import { useState } from 'react';

export default function Notification({ message, isError = false, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide notification after duration
  setTimeout(() => {
    setIsVisible(false);
  }, duration);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed top-4 right-4 px-6 py-3 rounded-lg text-white shadow-lg transform transition-all duration-300 z-50 ${
        isError ? 'bg-error' : 'bg-success'
      }`}
    >
      {message}
    </div>
  );
}
