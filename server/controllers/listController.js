const ShoppingList = require('../models/ShoppingList');

// Get user's shopping list
exports.getList = async (req, res) => {
    try {
        const list = await ShoppingList.findOne({ user: req.user._id });
        
        if (list) {
            res.json(list);
        } else {
            // Create a new list if one doesn't exist
            const newList = await ShoppingList.create({
                user: req.user._id,
                items: []
            });
            res.json(newList);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Save user's shopping list
exports.saveList = async (req, res) => {
    try {
        const { items } = req.body;
        
        let list = await ShoppingList.findOne({ user: req.user._id });
        
        if (list) {
            // Update existing list
            list.items = items;
            await list.save();
        } else {
            // Create new list
            list = await ShoppingList.create({
                user: req.user._id,
                items
            });
        }
        
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};