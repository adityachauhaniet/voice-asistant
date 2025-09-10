const Item = require('../models/Item');

// Get all items for a user
exports.getItems = async (req, res) => {
    try {
        const items = await Item.find({ user: req.user._id });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new item
exports.addItem = async (req, res) => {
    try {
        const { name, quantity, completed } = req.body;
        
        const item = await Item.create({
            name,
            quantity: quantity || '1',
            completed: completed || false,
            user: req.user._id
        });
        
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an item
exports.updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, completed } = req.body;
        
        const item = await Item.findOne({ _id: id, user: req.user._id });
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        if (name !== undefined) item.name = name;
        if (quantity !== undefined) item.quantity = quantity;
        if (completed !== undefined) item.completed = completed;
        
        await item.save();
        
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an item
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        
        const item = await Item.findOne({ _id: id, user: req.user._id });
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        
        await Item.deleteOne({ _id: id, user: req.user._id });
        
        res.json({ message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};