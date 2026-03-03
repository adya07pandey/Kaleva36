import express from "express";
import {
  createMenuItem,
  getMenuItems,
  searchMenuItems,
} from "../controllers/menuController.js";


const router = express.Router();


router.post("/", createMenuItem);
router.get("/", searchMenuItems);
router.get("/items",getMenuItems);
export default router;