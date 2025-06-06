// src/controllers/passwordController.js
const prisma = require('../database/prisma');
const bcrypt = require('bcrypt');
const Sib = require('sib-api-v3-sdk');
require('dotenv').config();

exports.forgotPassword = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email: req.body.email }
        });
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const resetRequest = await prisma.forgotPasswordRequest.create({
            data: { userId: user.id }
        });
        
        const defaultClient = Sib.ApiClient.instance;
        defaultClient.authentications['api-key'].apiKey = process.env.SENDINBLUE_API_KEY;

        const resetUrl = `${process.env.BASE_URL}/password/resetpassword/${resetRequest.id}`;
        
        try {
            await new Sib.TransactionalEmailsApi().sendTransacEmail({
                to: [{ email: req.body.email }],
                sender: { email: process.env.SENDER_EMAIL, name: "Expense Tracker" },
                subject: "Password Reset Request",
                htmlContent: `
                    <h1>Reset Your Password</h1>
                    <p>Click the link below to set a new password:</p>
                    <a href="${resetUrl}">Reset Password</a>
                    <p>This link will expire after use.</p>`
            });
            return res.status(200).json({ success: true, message: 'Password reset link sent' });
        } catch (emailError) {
            // Delete the reset request if email fails
            await prisma.forgotPasswordRequest.delete({
                where: { id: resetRequest.id }
            });
            return res.status(500).json({ success: false, message: 'Error sending reset email' });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.verifyResetToken = async (req, res) => {
    try {
        const resetRequest = await prisma.forgotPasswordRequest.findFirst({
            where: { 
                id: req.params.token, 
                isActive: true 
            }
        });

        return resetRequest 
            ? res.status(200).json({ success: true, message: 'Valid reset token' })
            : res.status(400).json({ success: false, message: 'Invalid or expired reset link' });
    } catch (error) {
        console.error('Verify reset token error:', error);
        return res.status(500).json({ success: false, message: 'Error verifying token' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const resetRequest = await prisma.forgotPasswordRequest.findFirst({
            where: { 
                id: req.params.token, 
                isActive: true 
            }
        });

        if (!resetRequest) {
            return res.status(400).json({ success: false, message: 'Invalid or expired reset link' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Using Prisma transaction
        await prisma.$transaction([
            prisma.user.update({
                where: { id: resetRequest.userId },
                data: { password: hashedPassword }
            }),
            prisma.forgotPasswordRequest.update({
                where: { id: req.params.token },
                data: { isActive: false }
            })
        ]);

        return res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(500).json({ success: false, message: 'Error resetting password' });
    }
};

module.exports = exports;
