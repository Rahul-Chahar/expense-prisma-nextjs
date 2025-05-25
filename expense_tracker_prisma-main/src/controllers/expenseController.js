// src/controllers/expenseController.js
const prisma = require('../database/prisma');

exports.addExpense = async (req, res) => {
    try {
        const { amount, description, category, type } = req.body;
        const userId = req.user.id;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        // Using Prisma transaction
        await prisma.$transaction(async (tx) => {
            // Create expense
            await tx.expense.create({
                data: {
                    userId,
                    amount,
                    description,
                    category,
                    type
                }
            });

            // Update user's total expenses if it's an expense type
            if (type === 'expense') {
                const expenses = await tx.expense.aggregate({
                    where: { 
                        userId, 
                        type: 'expense' 
                    },
                    _sum: {
                        amount: true
                    }
                });
                
                const totalExpenses = expenses._sum.amount || 0;
                
                await tx.user.update({
                    where: { id: userId },
                    data: { totalExpenses }
                });
            }
        });

        return res.status(201).json({ message: 'Transaction added successfully' });
    } catch (error) {
        console.error('Add expense error:', error);
        return res.status(500).json({ message: error.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        // Using Prisma transaction
        await prisma.$transaction(async (tx) => {
            // Find expense
            const expense = await tx.expense.findFirst({
                where: {
                    id: parseInt(req.params.id),
                    userId: req.user.id
                }
            });

            if (!expense) {
                throw new Error('Transaction not found');
            }

            // Delete expense
            await tx.expense.delete({
                where: { id: expense.id }
            });

            // Update user's total expenses if it was an expense type
            if (expense.type === 'expense') {
                const expenses = await tx.expense.aggregate({
                    where: { 
                        userId: req.user.id, 
                        type: 'expense' 
                    },
                    _sum: {
                        amount: true
                    }
                });
                
                const totalExpenses = expenses._sum.amount || 0;
                
                await tx.user.update({
                    where: { id: req.user.id },
                    data: { totalExpenses }
                });
            }
        });

        return res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Delete expense error:', error);
        if (error.message === 'Transaction not found') {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        return res.status(500).json({ message: error.message });
    }
};

exports.getExpenses = async (req, res) => {
    try {
        const expenses = await prisma.expense.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ expenses });
    } catch (error) {
        console.error('Get expenses error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getReport = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });
        
        if (!user.isPremium) {
            return res.status(403).json({ message: 'Premium feature only' });
        }

        let startDate = new Date();
        switch(req.params.type) {
            case 'daily':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'monthly':
                startDate.setDate(1);
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'yearly':
                startDate.setMonth(0, 1);
                startDate.setHours(0, 0, 0, 0);
                break;
        }

        const transactions = await prisma.expense.findMany({
            where: {
                userId: req.user.id,
                createdAt: { gte: startDate }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate summary
        const summary = transactions.reduce((s, t) => {
            t.type === 'income' ? s.totalIncome += Number(t.amount) : s.totalExpense += Number(t.amount);
            s.savings = s.totalIncome - s.totalExpense;
            return s;
        }, { totalIncome: 0, totalExpense: 0, savings: 0 });

        res.json({ transactions, summary });
    } catch (error) {
        console.error('Get report error:', error);
        res.status(500).json({ message: 'Error generating report' });
    }
};

module.exports = exports;
