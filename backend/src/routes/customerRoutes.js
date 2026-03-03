import express from "express";
import {
  createCustomer,
  getCustomers,
} from "../controllers/customerController.js";


const router = express.Router();


router.post("/", createCustomer);
router.get("/all", getCustomers);

export default router;