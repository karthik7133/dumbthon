const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
    itemRequested: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    itemOffered: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trade', TradeSchema);
