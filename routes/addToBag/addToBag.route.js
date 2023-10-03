const express = require('express');
const bagrouter = express.Router();

const {
    create,
    findBagItems,
    deleteBag, paymentstatus
} = require('../../controller/addToBag/addTobag.controller')

bagrouter.post("/create", create)  // http://localhost:5000/bag/create

bagrouter.get('/findBag/:userID', findBagItems)  // http://localhost:5000/bag/findBag/:userID

bagrouter.delete('/deleteBag/:userID/:PID', deleteBag); // http://localhost:5000/bag/deleteBag/:userID/:PID

bagrouter.put('/paymentstatus/:bagId', paymentstatus); // http://localhost:5000/bag/paymentstatus/:bagId


module.exports = bagrouter;