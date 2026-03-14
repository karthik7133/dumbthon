const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.faceUnlock = async (req, res) => {
    try {
        const { faceDescriptor } = req.body;

        const users = await User.find();

        const threshold = 0.55; // Slightly stricter for e-commerce
        let matchedUser = null;

        for (const user of users) {
            const dist = euclideanDistance(faceDescriptor, user.faceDescriptor);
            if (dist < threshold) {
                matchedUser = user;
                break;
            }
        }

        if (matchedUser) {
            const token = jwt.sign({ id: matchedUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.json({ token, user: matchedUser });
        } else {
            return res.status(401).json({ msg: 'Login failed. Face not recognized.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.registerFace = async (req, res) => {
    try {
        const { name, email, phone, faceDescriptor } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Email already registered.' });
        }

        user = new User({ name, email, phone, faceDescriptor });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

function euclideanDistance(arr1, arr2) {
    return Math.sqrt(arr1.reduce((sum, val, i) => sum + Math.pow(val - arr2[i], 2), 0));
}
