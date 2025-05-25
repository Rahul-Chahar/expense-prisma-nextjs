// src/controllers/userController.js
const prisma = require('../database/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: await bcrypt.hash(password, 10)
            }
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify password
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        res.status(200).json({
            message: 'Login successful',
            token: jwt.sign(
                { userId: user.id, isPremium: user.isPremium, email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            ),
            isPremium: user.isPremium
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in user' });
    }
};

module.exports = exports;
