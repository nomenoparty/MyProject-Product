const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/products.controller");

router.get("/", controller.index);

router.get("/detail/:slugProduct", controller.detail);

router.get("/:slugCategory", controller.category);

module.exports = router; 