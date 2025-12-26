import { Router } from "express";
import { createOrder, deleteOrder, updateOrder , getUserOrders } 
from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = new Router();

//Routes Declaration

router.route("/create").post(authenticate,createOrder);
router.route("/delete/:id").delete(authenticate,deleteOrder);
router.route("/update/:id").patch(authenticate,updateOrder);
router.route("/getUserOrders").get(authenticate,getUserOrders);

export default router;
