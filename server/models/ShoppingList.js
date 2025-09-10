const mongoose = require('mongoose');

const shoppingListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        quantity: {
            type: String,
            default: '1'
        },
        completed: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
});

// Ensure each user has only one shopping list
shoppingListSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('ShoppingList', shoppingListSchema);