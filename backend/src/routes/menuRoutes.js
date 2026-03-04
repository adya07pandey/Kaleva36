import express from "express";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuItems,
  searchMenuItems,
} from "../controllers/menuController.js";


const router = express.Router();


router.post("/", createMenuItem);
router.get("/", searchMenuItems);
router.get("/items",getMenuItems);
router.delete("/:id", deleteMenuItem);
export default router;