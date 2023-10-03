const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },

    avatar: [{
        type: String,
    }],

    price: {
        type: Number,
        required: true,
    },

    reperchsaeBV :{
        type: Number, 
    },

    orderConfirmed:{
        type: Boolean,
        default: false
    },

    category: {
        type: String,
        enum: ['Electronics', 'Clothing', 'Books', 'Other'],
        required: true,
    },
    stock: {
        type: Number,
        default: 6,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const product = mongoose.model('product', productSchema);

module.exports = product;