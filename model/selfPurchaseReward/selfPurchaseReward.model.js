const mongoose = require('mongoose');

const selfPurchaseRewardSchema = new mongoose.Schema({
    bpCheckpoint: {
        type: String,
        default: null
    },
    prize: {
        type: String,
        default: null
    }
})

const selfPurchaseReward = mongoose.model("selfPurchaseReward", selfPurchaseRewardSchema);

module.exports = selfPurchaseReward;