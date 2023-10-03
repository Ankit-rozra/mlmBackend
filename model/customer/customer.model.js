const mongoose = require('mongoose');

// const validateRecruitsCount = function (recruits) {
//     return recruits.length <= 1;
// };
const userSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    mobile: {
        type: String,
        default: null,
        unique: true
    },
    adhaarNumber: {
        type: String,
        // required: false
    },
    address: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    question: {
        type: String,
    },
    answer: {
        type: String,
        // required: false
    },
    password: {
        type: String,
        default: null
    },
    prize: {
        type: String,
        default: null
    },
    topupAmount: {
        type: Number,
        default: null
    },
    directJoinningBonus: {
        type: Number,
        default: 0
    },
    pairEarning: {
        type: Number,
        default: 0
    },
    bv: {
        type: Number,
        default: 0
    },
    bp: {
        type: Number,
        default: 0
    },
    pv:{
        type: Number,
        default: 0
    },
    upi:{
        type: String,
        default: null
    },
    referralCode: {
        type: String,
        unique: true
    },
    searchCode:{
        type: String,
        unique: true
    },
    lengthSC:{
        type: Number,
        default: 0
    },
    customerVerified:{
        type: Boolean,
        default: false
    },
    sponsor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subSponser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recruits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]

});

function generateReferralCode(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
}
userSchema.pre('save', function (next) {
    if (!this.referralCode) {
        const codeLength = 8;
        this.referralCode = generateReferralCode(codeLength);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;