const express = require('express');

const selfPurchaseRewardRouter = express.Router();
const {
    create, findPrize, findAll
}= require('../../controller/selfPurchaseReward/selfPurchaseReward.controller');

selfPurchaseRewardRouter.post("/create", create); //http://localhost:5000/selfPurchaseReward/create

selfPurchaseRewardRouter.get("/findPrize", findPrize); //http://localhost:5000/selfPurchaseReward/findPrize

selfPurchaseRewardRouter.get("/findall", findAll); //http://localhost:5000/selfPurchaseReward/findall


module.exports = selfPurchaseRewardRouter