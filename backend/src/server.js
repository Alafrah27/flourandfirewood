import express from "express";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./lib/connectDb.js";
import imagekit from "./lib/imagekit.js";
import userRoute from "./route/user.route.js";
import categoryRoute from "./route/category.route.js";
import productRoute from "./route/product.route.js";
import settingsRoute from "./route/settings.route.js";
import tableRoute from "./route/table.route.js";
import cartRoute from "./route/cart.route.js";
import paymentRoute from "./route/payment.route.js";
import orderRoute from "./route/order.route.js";
import dashboardRoute from "./route/dashboard.route.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(clerkMiddleware());
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  }),
);
app.use(helmet());

app.get("/health", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/v1/imagekit", (req, res) => {
  const result = imagekit.getAuthenticationParameters();
  console.log(result);
  res.send(result);
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/settings", settingsRoute);
app.use("/api/v1/table", tableRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/moyasar/payment", paymentRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/dashboard", dashboardRoute);

const PORT = process.env.PORT || 7000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("error", err));
