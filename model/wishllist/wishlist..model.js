const mongoose = require('mongoose');

const wishlistModel = new mongoose.Schema({
    PID: {
        // type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product', 
        // required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Wishlist = mongoose.model('Wishlist', wishlistModel);

module.exports = Wishlist;
