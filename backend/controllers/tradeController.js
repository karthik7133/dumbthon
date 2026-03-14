const Trade = require('../models/Trade');
const Item = require('../models/Item');

exports.requestTrade = async (req, res) => {
    try {
        const { itemRequested, itemOffered, sender, receiver } = req.body;
        const newTrade = new Trade({ itemRequested, itemOffered, sender, receiver });
        await newTrade.save();
        res.status(201).json(newTrade);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTrades = async (req, res) => {
    try {
        const { userId } = req.query; // Filter by user involved
        const trades = await Trade.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).populate('itemRequested itemOffered sender receiver');
        res.json(trades);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTradeStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const trade = await Trade.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (status === 'accepted') {
            // Mark items as traded or swap owners (simple version: mark as traded)
            await Item.findByIdAndUpdate(trade.itemRequested, { status: 'traded' });
            await Item.findByIdAndUpdate(trade.itemOffered, { status: 'traded' });
        }

        res.json(trade);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
