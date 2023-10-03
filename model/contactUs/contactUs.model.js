const mongoose = require('mongoose');



const contactUsSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    userName:{
        type: String,
        required: false,
        default: null
    },

    communicationWay:{
        type: String,
        required: false,
        default: null
    },

    message:{
        type: String,
        required: false,
        default: null
    },

});

const contactUs = mongoose.model('contactUs', contactUsSchema);

module.exports = contactUs;