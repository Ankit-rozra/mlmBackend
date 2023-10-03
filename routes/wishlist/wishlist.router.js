const express = require('express');
const wishlist = express.Router();

const {
    addwhislist,
    findWishlist,
    deleteWish
} = require('../../controller/wishlist/wishlist.controller');

wishlist.post('/create', addwhislist)  // http://localhost:5000/wishlist/create

wishlist.get('/findWish/:userID', findWishlist) // http://localhost:5000/wishlist/findWish/:userID

wishlist.delete('/deleteWish/:userID/:PID', deleteWish); // http://localhost:5000/wishlist/deleteWish/:userID/:PID


module.exports = wishlist;