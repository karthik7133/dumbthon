const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.faceUnlock = async (req, res) => {
    try {
        const { faceDescriptor } = req.body;

        if (!faceDescriptor || !Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
            return res.status(400).json({ msg: 'Invalid face descriptor provided.' });
        }

        const users = await User.find({}, 'name email phone faceDescriptor lastLogin');

        if (!users || users.length === 0) {
            return res.status(401).json({ msg: 'No users registered. Please sign up first.' });
        }

        // More lenient threshold for better recognition across lighting conditions
        const threshold = 0.6;
        let bestMatch = null;
        let bestDist = Infinity;

        for (const user of users) {
            if (!user.faceDescriptor || user.faceDescriptor.length !== 128) continue;
            const dist = euclideanDistance(faceDescriptor, user.faceDescriptor);
            if (dist < bestDist) {
                bestDist = dist;
                bestMatch = user;
            }
        }

        if (bestMatch && bestDist < threshold) {
            // Update last login time
            await User.findByIdAndUpdate(bestMatch._id, { lastLogin: new Date() });

            const token = jwt.sign({ id: bestMatch._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
            return res.json({
                token,
                user: {
                    _id: bestMatch._id,
                    name: bestMatch.name,
                    email: bestMatch.email,
                    phone: bestMatch.phone,
                }
            });
        } else {
            return res.status(401).json({
                msg: `Face not recognized. ${bestDist !== Infinity ? `Closest match distance: ${bestDist.toFixed(3)} (threshold: ${threshold})` : 'No users found.'}`,
            });
        }
    } catch (err) {
        console.error('[faceUnlock] Error:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.registerFace = async (req, res) => {
    try {
        const { name, email, phone, faceDescriptor } = req.body;

        if (!name || !email || !faceDescriptor) {
            return res.status(400).json({ msg: 'Name, email, and face descriptor are required.' });
        }

        if (!Array.isArray(faceDescriptor) || faceDescriptor.length !== 128) {
            return res.status(400).json({ msg: 'Invalid face descriptor. Please try scanning again.' });
        }

        let user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user) {
            return res.status(400).json({ msg: 'An account with this email already exists. Please log in.' });
        }

        console.log(`[registerFace] Registration attempt for: ${email}`);
        user = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone ? phone.trim() : '',
            faceDescriptor,
        });
        await user.save();
        console.log(`[registerFace] User ${email} successfully registered (ID: ${user._id}).`);

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
            }
        });
    } catch (err) {
        console.error('[registerFace] Error:', err);
        if (err.code === 11000) {
            return res.status(400).json({ msg: 'An account with this email already exists.' });
        }
        res.status(500).json({ error: err.message });
    }
};

function euclideanDistance(arr1, arr2) {
    if (!arr1 || !arr2 || arr1.length !== arr2.length) return Infinity;
    return Math.sqrt(arr1.reduce((sum, val, i) => sum + Math.pow(val - arr2[i], 2), 0));
}
