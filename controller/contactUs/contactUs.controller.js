const contactUs = require("../../model/contactUs/contactUs.model");

const create = async (req, res) => {
    try {
        var {
            userID,  
            userName,
            communicationWay,
            message,
        } = req.body

        
        var newData = new contactUs({
            userID:userID,
            userName: userName,
            communicationWay: communicationWay,
            message: message,
        })
        
        const contactData = await newData.save();

        res.status(200).send({
            success: true,
            msg: "Data Submitted Successfully",
            data: contactData
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            msg: error.message
        });
    }
}

const findAll = async (req, res) => {
    try {
        var data = await contactUs.find({});
        return res.status(201).json(data);
    } catch (err) {
        return res.status(500).json({
            message: "error",
            err,
        });
    }
}

const findbyID = async (req, res) => {
    const { _id } = req.params;

    try {
        var data = await contactUs.findOne({ _id: _id});
        if (!data) {
            return res.status(404).json({ msg: "User not found" })
       }
        return res.status(201).json(data);
    } catch (err) {
        return res.status(500).json({
            message: "error",
            err,
        });
    }
}


module.exports = {
    create, findAll, findbyID
};