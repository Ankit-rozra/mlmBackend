const  express = require('express');
const contactUs = express.Router();

const {
    create , findAll, findbyID
} = require("../../controller/contactUs/contactUs.controller")


contactUs.post('/create', create) // http://localhost:5000/contactUs/create

contactUs.get('/findall', findAll) // http://localhost:5000/contactUs/findall

contactUs.get('/findone/:_id', findbyID) // http://localhost:5000/contactUs/findbyID/:_id

module.exports = contactUs;
