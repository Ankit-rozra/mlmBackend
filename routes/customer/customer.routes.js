const express = require("express");

const userRouter = express.Router();


const {
    create,
    userRegEmail,
    userRegMobile,
    userInfo,
    loginWithUserName,
    pairEarning,
    alldata,
    autoPool,
    leftRightPurchaces,
    frogetPass, statusUpdate ,deleteuser
} = require("../../controller/customer/customer.controller");

userRouter.post("/create", create); //httt://localhost:5000/user/create

userRouter.post("/emailreg", userRegEmail);  //http://localhost:5000/user/emailreg

userRouter.post("/pairearning/:_id", pairEarning);  //http://localhost:5000/user/pairearning/_id

userRouter.post("/mobilereg", userRegMobile);  //httt://localhost:5000/user/mobilereg

userRouter.get("/userInfo/:_id", userInfo);  //http://localhost:5000/user/userInfo/64ea4e7fb1a01a5230cf11f2

userRouter.post("/userlogin", loginWithUserName);  //http://localhost:5000/user/userlogin

userRouter.get("/alldata", alldata); //http://localhost:5000/user/alldata

userRouter.get("/alltopup", autoPool); //http://localhost:5000/user/alltopup

userRouter.get("/leftright/:_id", leftRightPurchaces); //http://localhost:5000/user/leftright

userRouter.put("/forgetPass", frogetPass)  // http://localhost:5000/user/forgetPass

userRouter.put("/statusupdate/:id", statusUpdate)  // http://localhost:5000/user/statusupdate/id

userRouter.delete("/delete/:id", deleteuser)  // http://localhost:5000/user/delete/ID

module.exports = userRouter;