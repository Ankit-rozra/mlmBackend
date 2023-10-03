const  express = require('express');
const productOrder = express.Router();

const {
    create ,
    findall ,
    statusUpdate, allfalseorders ,alltrueorders ,deleteOrder
} = require("../../controller/productOrder/productOrder.controller")


productOrder.post('/create', create) // http://localhost:5000/productorder/create

productOrder.get('/findall', findall) // http://localhost:5000/productorder/findall

productOrder.put("/statusupdate/:id", statusUpdate)  // http://localhost:5000/productorder/statusupdate/id

productOrder.get("/allfalse", allfalseorders)  // http://localhost:5000/productorder/allfalse

productOrder.get("/alltrue", alltrueorders)  // http://localhost:5000/productorder/alltrue

productOrder.delete("/delete/:id", deleteOrder)  // http://localhost:5000/productorder/delete/ID

module.exports = productOrder;
