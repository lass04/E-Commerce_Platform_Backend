import { Router } from "express";
import { createOrder, deleteOrder, updateOrder , getUserOrders } from "../controllers/order.controller.js";

const router = new Router();

//Routes Declaration

router.route("/createOrder").post(createOrder);
router.route("/deleteOrder").delete(deleteOrder);
router.route("/updateOrder").patch(updateOrder);
router.route("/getUserOrders").get(getUserOrders);

export default router;
