const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(uri);
        console.log(`Successfully connected to DB: ${mongoose.connection.name}`);
    } catch (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
