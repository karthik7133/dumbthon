const Order = require('../models/Order');

// POST /api/orders — place a new order
exports.placeOrder = async (req, res) => {
    try {
        const { userId, items, total, address, paymentMethod } = req.body;

        if (!userId || !items || !items.length || !total) {
            return res.status(400).json({ msg: 'userId, items and total are required.' });
        }

        const order = new Order({ userId, items, total, address, paymentMethod });
        await order.save();

        console.log(`[placeOrder] Order ${order.orderId} saved for user ${userId}`);
        res.status(201).json({ order });
    } catch (err) {
        console.error('[placeOrder] Error:', err);
        res.status(500).json({ error: err.message });
    }
};

// GET /api/orders/:userId — fetch order history for a user
exports.getOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.json({ orders });
    } catch (err) {
        console.error('[getOrders] Error:', err);
        res.status(500).json({ error: err.message });
    }
};
