const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/checkout.controller");

const authMiddleware = require("../../middlewares/client/auth.middleware");

router.get("/", authMiddleware.requireAuth, controller.index);
router.post("/order", controller.order);
router.get("/success/:orderId", controller.success);

module.exports = router;