# Next.js Expense Tracker - Project Documentation

## Overview
This project is a modernized version of the original Expense Tracker application, converted to Next.js with the App Router architecture. The application maintains all the original functionality while providing a modern UI with light and dark theme support.

## Features
- User authentication (login, signup, password reset)
- Expense tracking with categorization
- Income and expense management
- Premium subscription features
- Financial reports and analytics
- Leaderboard functionality
- Responsive design for all devices
- Light and dark theme support

## Tech Stack
- Next.js (App Router)
- JavaScript
- Tailwind CSS
- Context API for state management

## Project Structure
The project follows a modular structure with clear separation of concerns:

```
expense-tracker/
├── app/                           # App Router pages
│   ├── api/                       # API routes
│   ├── expenses/                  # Expenses dashboard
│   ├── login/                     # Login page
│   ├── reset-password/            # Reset password page
│   ├── signup/                    # Signup page
│   ├── globals.css                # Global styles
│   └── layout.js                  # Root layout
├── components/                    # Reusable components
│   ├── auth/                      # Authentication components
│   ├── expenses/                  # Expense-related components
│   ├── layout/                    # Layout components
│   ├── premium/                   # Premium feature components
│   └── ui/                        # UI components
├── context/                       # React Context
│   ├── AuthContext.js             # Authentication context
│   ├── ExpenseContext.js          # Expense data context
│   └── ThemeContext.js            # Theme context
└── lib/                           # Utility functions
```

## Getting Started

### Prerequisites
- Node.js 16.8 or later
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production
```
npm run build
npm start
```

## API Integration
The application integrates with the following API endpoints:

### Authentication
- `/api/users/login` - User login
- `/api/users/signup` - User registration
- `/api/password/forgotpassword` - Request password reset
- `/api/password/resetpassword/:token` - Reset password with token

### Expenses
- `/api/expenses/user` - Get user expenses
- `/api/expenses/add` - Add new expense
- `/api/expenses/:id` - Delete expense
- `/api/expenses/report/:type` - Get expense reports

### Premium Features
- `/api/premium/status` - Check premium status
- `/api/premium/leaderboard` - Get leaderboard data
- `/api/payments/create-order` - Create payment order
- `/api/payments/update-status` - Update payment status
- `/api/expenses/download` - Download expense report
- `/api/expenses/download-history` - Get download history

## Theme Customization
The application supports light and dark themes with a positive vibe. The theme can be toggled using the theme toggle button in the navigation bar. Theme preferences are saved in localStorage.

## Responsive Design
The application is fully responsive and works well on all device sizes from mobile to desktop.

## Best Practices
- Modular component architecture
- Context API for state management
- Proper error handling
- Responsive design principles
- Accessibility considerations
- Performance optimizations

## Future Enhancements
- TypeScript integration
- Server-side rendering for improved SEO
- More detailed analytics and reporting
- Budget planning features
- Mobile app with React Native
