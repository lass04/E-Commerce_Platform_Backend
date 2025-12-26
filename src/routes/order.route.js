import { Router } from "express";
import { createOrder, deleteOrder, updateOrder , getOrders, getUserOrders } 
from "../controllers/order.controller.js";
import { authenticate , adminOnly } from "../middlewares/auth.middleware.js";

const router = new Router();

//Routes Declaration

router.route("/create").post(authenticate,createOrder);
router.route("/delete/:id").delete(authenticate,deleteOrder);
router.route("/update/:id").patch(authenticate,updateOrder);
router.route("/getUserOrders/:id").get(authenticate,getUserOrders);
router.route("/getOrders").get(adminOnly,getOrders);

export default router;
