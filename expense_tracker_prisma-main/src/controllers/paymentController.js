// src/controllers/paymentController.js
const Razorpay = require('razorpay');
const prisma = require('../database/prisma');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
    try {
        const order = await razorpay.orders.create({
            amount: 2500,
            currency: "INR",
            receipt: `order_${Date.now()}`
        });

        await prisma.order.create({
            data: {
                userId: req.user.id,
                orderId: order.id,
                status: 'PENDING'
            }
        });

        res.json({
            order_id: order.id,
            key_id: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
};

exports.updateTransactionStatus = async (req, res) => {
    try {
        const { payment_id, order_id, status } = req.body;

        if (status === 'SUCCESSFUL') {
            // Using Prisma transaction
            await prisma.$transaction([
                prisma.order.updateMany({
                    where: { orderId: order_id },
                    data: { 
                        status, 
                        paymentId: payment_id 
                    }
                }),
                prisma.user.update({
                    where: { id: req.user.id },
                    data: { isPremium: true }
                })
            ]);
            
            return res.json({ 
                success: true,
                message: 'Payment successful',
                isPremium: true 
            });
        }

        await prisma.order.updateMany({
            where: { orderId: order_id },
            data: { 
                status, 
                paymentId: payment_id 
            }
        });
        
        res.json({ 
            success: true,
            message: `Transaction ${status.toLowerCase()}`,
            isPremium: false 
        });
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error updating transaction' 
        });
    }
};

module.exports = exports;
