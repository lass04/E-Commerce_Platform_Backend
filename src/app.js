import express from "express";
import userRouter from "./routes/user.route.js";
import orderRouter from "./routes/order.route.js";
import cookieParser from "cookie-parser";

const app = express();

// Request & Cookie Parsing Middlewares
app.use(express.json());
app.use(cookieParser());

// Declaring Routes
app.use("/api/v1/users",userRouter)
app.use("/ai/v1/orders",orderRouter)

export default app;