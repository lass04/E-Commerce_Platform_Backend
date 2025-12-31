import { Router } from "express";
import { createOrder, deleteOrder, updateOrder , getOrders, getUserOrders , updateStatus} 
from "../controllers/order.controller.js";
import { authenticate , adminOnly } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";
import requestValidator from "../middlewares/reqValidation.middleware.js";

const router = new Router();

//Routes Declaration

router.route("/create").post(
    [
        body("items.*.quantity").isInt().withMessage("Quantity must be an Integer"),
        body("items.*.price").isFloat({min:0}).withMessage("Price must be a non negative float "),
        body("totalPrice").isFloat({min:0}).withMessage("Total Price must be a non negative float ")
    ],
    requestValidator,
    authenticate,
    createOrder
);


router.route("/delete/:id").delete(authenticate,deleteOrder);
router.route("/update/:id").patch(authenticate,updateOrder);
router.route("/updateStatus/:id").patch(adminOnly,updateStatus);
router.route("/getUserOrders/:id").get(authenticate,getUserOrders);
router.route("/getOrders").get(adminOnly,getOrders);

export default router;
