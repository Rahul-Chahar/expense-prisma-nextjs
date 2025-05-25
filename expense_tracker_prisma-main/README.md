# Expense Tracker - Migration Guide

## Overview
This project has been migrated from Sequelize ORM with MySQL to Prisma ORM with PostgreSQL. This guide will help you set up and run the migrated project.

## Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Setup Instructions

### 1. Install PostgreSQL
If you don't have PostgreSQL installed:
- **Windows**: Download and install from [postgresql.org](https://www.postgresql.org/download/windows/)
- **Mac**: Use Homebrew: `brew install postgresql`
- **Linux**: Use your package manager: `sudo apt install postgresql postgresql-contrib`

### 2. Create a PostgreSQL Database
```bash
# Log into PostgreSQL
psql -U postgres

# Create a database
CREATE DATABASE expense_tracker;

# Exit
\q
```

### 3. Install Project Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create or update the `.env` file in the project root with the following:

```
# PostgreSQL Database Configuration
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/expense_tracker"

# Other environment variables
JWT_SECRET="your_jwt_secret_key"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
SENDINBLUE_API_KEY="your_sendinblue_api_key"
AWS_ACCESS_KEY="your_aws_access_key"
AWS_SECRET_KEY="your_aws_secret_key"
AWS_BUCKET_NAME="your_aws_bucket_name"
AWS_REGION="your_aws_region"
```

Replace `your_password` with your PostgreSQL password and update other values as needed.

### 5. Generate Prisma Client and Create Database Tables
```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init
```

### 6. Start the Application
```bash
npm start
```

The application should now be running on http://localhost:8080

## Key Changes in the Migration

### 1. ORM Migration: Sequelize to Prisma
- Replaced Sequelize models with Prisma schema
- Updated all database queries to use Prisma client
- Implemented Prisma transactions for data consistency

### 2. Database Migration: MySQL to PostgreSQL
- Changed database connection configuration
- Updated data types to be compatible with PostgreSQL
- Implemented PostgreSQL-specific features where applicable

### 3. Code Structure Changes
- Added `prisma` directory with schema definition
- Updated database connection logic
- Simplified transaction handling

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check your DATABASE_URL in the .env file
- Ensure your PostgreSQL user has proper permissions

### Prisma Client Generation
If you encounter issues with Prisma client:
```bash
# Regenerate Prisma client
npx prisma generate
```

### Schema Changes
If you need to modify the database schema:
1. Update the schema in `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_change_name`

## Additional Resources
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
