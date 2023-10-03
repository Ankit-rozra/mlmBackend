const selfPurchaseReward = require("../../model/selfPurchaseReward/selfPurchaseReward.model");

const create = async (req, res, next) => {
    try {
        const { bpCheckpoint, prize } = req.body;

        const newReward = new selfPurchaseReward({
            bpCheckpoint: bpCheckpoint,
            prize: prize,
        });

        const savedReward = await newReward.save();
        res.status(201).json(savedReward);
    } catch (error) {
        res.status(500).json({ error: "An error occurred while creating the reward." });
    }
};



const findPrize = async (req, res, next) => {

    try {
        const { BP } = req.body;
        var enteredBP;
        if (BP < 500) {
            return res.status(400).json({ "Message": "No Prize yet" });
        } else if (BP >= 500 && BP < 1990) {
            enteredBP = 500
        } else if (BP >= 2000 && BP < 4499) {
            enteredBP = 2000
        } else if (BP >= 4500 && BP < 11999) {
            enteredBP = 2000
        } else if (BP >= 12000 && BP < 24999) {
            enteredBP = 12000
        } else if (BP >= 25000 && BP < 49999) {
            enteredBP = 25000
        } else if (BP >= 50000 && BP < 99999) {
            enteredBP = 50000
        } else if (BP >= 100000 && BP < 199999) {
            enteredBP = 100000
        } else if (BP >= 200000 && BP < 399999) {
            enteredBP = 200000
        } else if (BP >= 400000 && BP < 899999) {
            enteredBP = 400000
        } else if (BP >= 900000) {
            enteredBP = 900000
        }

        const reward = await selfPurchaseReward.findOne({ bpCheckpoint: enteredBP });
        res.json({ prize: reward.prize });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while checking the prize.' });
    }
}

const findAll = async (req, res, next) => {

    try {
        var data = await selfPurchaseReward.find({});
        return res.status(201).json(data);
    } catch (err) {
        return res.status(500).json({
            message: "error",
            err,
        });
    }

}

module.exports = { create, findPrize, findAll };