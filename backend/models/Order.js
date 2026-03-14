const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    itemId: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    quantity: { type: Number, required: true, default: 1 },
});

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    address: {
        fullName: String,
        phone: String,
        pincode: String,
        houseNo: String,
        area: String,
        city: String,
        state: String,
    },
    paymentMethod: { type: String, default: 'card' },
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered'], default: 'confirmed' },
    orderId: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now },
});

// Auto-generate a short order ID before saving
OrderSchema.pre('save', function (next) {
    if (!this.orderId) {
        this.orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Order', OrderSchema);
