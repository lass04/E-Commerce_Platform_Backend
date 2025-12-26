import express from "express";
import userRouter from "./routes/user.route.js";
import orderRouter from "./routes/order.route.js";
import cookieParser from "cookie-parser";
import categoryRouter from "./routes/category.route.js";
import cartRouter from "./routes/cart.route.js";
import productRouter from "./routes/product.route.js";
import { rateLimiter } from "./middlewares/rateLimit.middleware.js";
import cors from "cors";

const app = express();

// Request & Cookie Parsing Middlewares
app.use(express.json());
app.use(cookieParser());

// Cors Configuration
app.use(cors({
    origin:"http://localhost:4002",
    methods:["GET","POST","PUT","DELETE"],
    allowHeaders: ["Content-Type","Authorization"],
    credentials:true
}));

// Applying RateLimiter in all app routes
app.use(rateLimiter);

// Declaring Routes
app.use("/api/v1/users",userRouter)
app.use("/api/v1/orders",orderRouter)
app.use("/api/v1/products",productRouter)
app.use("/api/v1/carts",cartRouter)
app.use("/api/v1/categories",categoryRouter)

export default app;