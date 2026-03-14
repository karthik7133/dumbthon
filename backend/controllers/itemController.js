const Item = require('../models/Item');

exports.createItem = async (req, res) => {
    try {
        const { title, description, image, owner } = req.body;
        const newItem = new Item({ title, description, image, owner });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find().populate('owner', 'name');
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate('owner', 'name');
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteItem = async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Item broadcast cancelled (deleted)' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
