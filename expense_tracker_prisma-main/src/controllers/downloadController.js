// controllers/downloadController.js
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../services/awsService');
const prisma = require('../database/prisma');

exports.downloadExpenses = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all expenses for the user
        const expenses = await prisma.expense.findMany({
            where: { userId },
            select: {
                amount: true,
                description: true,
                category: true,
                type: true,
                createdAt: true
            }
        });

        if (!expenses.length) {
            return res.status(404).json({ message: 'No expenses found' });
        }

        // Convert expenses to CSV format with proper escaping
        const csvData = expenses.map(expense => {
            // Escape double quotes and commas in fields
            const description = `"${expense.description.replace(/"/g, '""')}"`;
            const category = `"${expense.category.replace(/"/g, '""')}"`;
            return `${expense.amount},${description},${category},${expense.type},${expense.createdAt}`;
        }).join('\n');

        const csvHeader = 'Amount,Description,Category,Type,Date\n';
        const csvContent = csvHeader + csvData;

        // Define S3 key
        const s3Key = `expenses/user_${userId}_${Date.now()}.csv`;

        // Prepare the PutObjectCommand
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: s3Key,
            Body: csvContent,
            ContentType: 'text/csv',
        });

        // Upload CSV to S3 using AWS SDK v3
        await s3.send(command);

        // Generate the file URL
        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

        // Save download history
        await prisma.downloadHistory.create({
            data: {
                userId,
                fileUrl
            }
        });

        res.json({ fileUrl });
    } catch (error) {
        console.error('Error downloading expenses:', error);
        res.status(500).json({ message: 'Error downloading expenses' });
    }
};

exports.getDownloadHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const history = await prisma.downloadHistory.findMany({
            where: { userId },
            select: {
                fileUrl: true,
                downloadedAt: true
            },
            orderBy: {
                downloadedAt: 'desc'
            }
        });

        res.json({ history });
    } catch (error) {
        console.error('Error fetching download history:', error);
        res.status(500).json({ message: 'Error fetching download history' });
    }
};
