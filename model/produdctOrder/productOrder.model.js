const mongoose = require('mongoose');

const productOrderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    productID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
    },

    quantity:{
        type: Number,
        default : 1
    },

    totalPrice: {
        type: Number
    },

    deliveryAddress: {
        type: String,
        default: null
    },

    orderStatus: {
        type: Boolean,
        default: false
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
})

const ProductOrder = mongoose.model('ProductOrder', productOrderSchema);

module.exports = ProductOrder

