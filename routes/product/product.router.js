const express = require('express');
const productRouter = express.Router();

const { 
   create,
   findproduct
} = require('../../controller/product/product.controller');

productRouter.post("/create", create)  // http://localhost:5000/product/create

productRouter.get("/findall", findproduct)  // http://localhost:5000/product/findall

module.exports = productRouter;
