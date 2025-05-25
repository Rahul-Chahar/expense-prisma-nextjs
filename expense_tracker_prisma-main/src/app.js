// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const prisma = require('./database/prisma');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(compression());
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/expenses', require('./routes/downloadRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/premium', require('./routes/premiumRoutes'));
app.use('/api/password', require('./routes/passwordRoutes'));

// Static routes
app.get('/password/resetpassword/:token', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/reset-password.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signup.html'));
});

// Handle Undefined Routes
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

// Start server
async function startServer() {
    try {
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error('Server startup failed:', error);
        process.exit(1);
    }
}

startServer();
