var express = require("express");
var router = express.Router();

var productModel = require("../models/productModel");
var upload = require("../ultil/uploadConfig");
const JWT = require("jsonwebtoken");
const config = require("../ultil/tokenConfig");

//- Lấy danh sách tất cả các sản phẩm
router.get("/all", async function (req, res) {
  try {
    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzMyMTUzNzI5LCJleHAiOjE3MzIxNTM3NTl9.4ZpLLQtCDoD3I3llrqz8nlq8K1Y173XN_B_aYfwr9WM
    const token = req.header("Authorization").split(" ")[1];
    if (token) {
      JWT.verify(token, config.SECRETKEY, async function (err, id) {
        if (err) {
          res.status(403).json({ status: false, message: "Có lỗi xảy ra: " + err });
        } else {
            var list = await productModel.find().populate("category");
            res.status(200).json(list);
        }
      });
    } else {
      res.status(401).json({ status: false, message: "Không xác thực" });
    }
  } catch (e) {
    res.status(400).json({ status: false, message: "Có lỗi xảy ra: " + e });
  }
});

//- Lấy danh sách tất cả các sản phẩm có số lượng lớn hơn 20
//localhost:3000/products/sp-lon-hon-X?soluong=200
router.get("/sp-lon-hon-X", async function (req, res) {
  try {
    const { soluong } = req.query;
    var list = await productModel.find({ quantity: { $gt: soluong } });
    res.status(200).json(list);
  } catch (e) {
    res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
  }
});

//- Lấy danh sách sản phẩm có giá từ 20000 đến 50000
//localhost:3000/products/sp-trong-khoang-gia?min=20000&max=50000
router.get("/sp-trong-khoang-gia", async function (req, res) {
  try {
    const { min, max } = req.query;
    var list = await productModel.find({ price: { $gte: min, $lte: max } });
    res.status(200).json(list);
  } catch (e) {
    res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
  }
});

//- Lấy danh sách sản phẩm có số lượng nhỏ hơn 10 hoặc giá lớn hơn 15000
router.get("/so-sanh", async function (req, res) {
  try {
    const { soluong, gia } = req.query;
    var list = await productModel.find({
      $or: [{ quantity: { $lt: soluong } }, { price: { $gt: gia } }],
    });
    res.status(200).json(list);
  } catch (e) {
    res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
  }
});
//- Lấy thông tin chi tiết của sản phẩm
router.get("/chi-tiet-sp/:id", async function (req, res) {
  try {
    const { id } = req.params;
    var detail = await productModel.findById(id);
    res.status(200).json(detail);
  } catch (e) {
    res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
  }
});

//thêm một sản phẩm mới
router.post("/add", async function (req, res) {
  try {
    const { name, price, quantity } = req.body;

    const newItem = { name, price, quantity };

    await productModel.create(newItem);
    res.status(200).json({ status: true, message: "Thành công" });
  } catch (e) {
    res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
  }
});

//chỉnh sửa
router.put("/edit", async function (req, res) {
  try {
    const { id, name, price, quantity } = req.body;

    //tìm sản phẩm cần chỉnh sửa
    const findProduct = await productModel.findById(id);

    if (findProduct) {
      //chỉnh sửa
      findProduct.name = name ? name : findProduct.name;
      findProduct.price = price ? price : findProduct.price;
      findProduct.quantity = quantity ? quantity : findProduct.quantity;
      await findProduct.save();
      res.status(200).json({ status: true, message: "Thành công" });
    } else {
      res.status(400).json({ status: false, message: "Không tìm thấy sp" });
    }
  } catch (e) {
    res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
  }
});

//xóa
router.delete("/delete/:id", async function (req, res) {
  try {
    const { id } = req.params;
    await productModel.findByIdAndDelete(id);
    res.status(200).json({ status: true, message: "Thành công" });
  } catch (e) {
    res.status(400).json({ status: false, message: "Có lỗi xảy ra" });
  }
});

//upload file
//localhost:3000/products/upload
router.post("/upload", [upload.single("image")], async (req, res, next) => {
  try {
    const { file } = req;
    if (!file) {
      return res.json({ status: 0, link: "" });
    } else {
      const url = `http://localhost:3000/images/${file.filename}`;
      return res.json({ status: 1, url: url });
    }
  } catch (error) {
    console.log("Upload image error: ", error);
    return res.json({ status: 0, link: "" });
  }
});

module.exports = router;
