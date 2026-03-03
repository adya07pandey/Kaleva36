import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import customerRoutes from "./routes/customerRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});