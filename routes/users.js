var express = require('express');
var router = express.Router();

var userModel = require("../models/userModel");
const JWT = require('jsonwebtoken');
const config = require("../ultil/tokenConfig");


//loaclhost:3000/users/all
//lấy toàn bộ danh sách user
router.get("/all", async function(req, res){
  var list = await userModel.find(); //lấy tất cả
  res.json(list);
});

//lấy toàn bộ danh sách user có độ tuổi lớn hơn X, 
//với X là số mà người dùng nhập vào
//QUERY: localhost:3000/users/findOld?oldX=xxx
router.get("/findOld", async function (req, res) {
  //query
  const {oldX} = req.query;
  var list = await userModel.find({old: {$gt: oldX}});
  res.json(list);
});

//PARAMS: localhost:3000/users/findOld2/xx
router.get("/findOld2/:oldX", async function (req, res) {
  //query
  const {oldX} = req.params;
  var list = await userModel.find({old: {$gt: oldX}});
  res.json(list);
});


router.post("/login", async function(req, res){
  try{
    const {username, password} = req.body;
    const checkUser = await userModel.findOne({username: username, password: password});
    if(checkUser == null){
      res.status(200).json({status: false, message:"Username và mật khẩu không đúng"});
    }else{
      const token = JWT.sign({username: username}, config.SECRETKEY, {expiresIn: '30s'});
      const refreshToken = JWT.sign({username: username}, config.SECRETKEY, {expiresIn: '1d'});
      res.status(200).json({status: true, message:"Đăng nhập thành công", token: token, refreshToken: refreshToken});
    }
  }catch(e){
    res.status(400).json({status: false, message: "Đã lỗi xảy ra"});
  }
});

router.get("/news", async function (req, res) {
  res.json({new:true});
});





module.exports = router;