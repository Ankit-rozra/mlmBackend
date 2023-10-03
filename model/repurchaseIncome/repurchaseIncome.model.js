const mongoose = require('mongoose');

const repurchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    leftNodeBV: {
        type: Number,
        required: true
    },
    rightNodeBV: {
        type: Number,
        required: true
    },
});

const Repurchase = mongoose.model('Repurchase', repurchaseSchema);

module.exports = Repurchase;
