// src/controllers/premiumController.js
const prisma = require('../database/prisma');

exports.getPremiumStatus = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { isPremium: true }
        });
        res.json({ isPremium: user.isPremium });
    } catch (error) {
        console.error('Error fetching premium status:', error);
        res.status(500).json({ message: 'Error fetching premium status' });
    }
};

exports.getLeaderboard = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                name: true,
                totalExpenses: true
            },
            orderBy: {
                totalExpenses: 'desc'
            }
        });

        res.json(users.map(user => ({
            name: user.name,
            totalExpenses: Number(user.totalExpenses) || 0
        })));
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Error fetching leaderboard' });
    }
};

module.exports = exports;
