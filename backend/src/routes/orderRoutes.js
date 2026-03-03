import express from "express";
import {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
  updateOrderStatus
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);   
router.patch("/:id/status", updateOrderStatus);

export default router;