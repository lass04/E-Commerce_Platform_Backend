import Router from "express";
import { addProductToCart, updateProductQuantity , removeProductFromCart , viewCartSummary , createCart } 
from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";
import validateRequest from "../middlewares/reqValidation.middleware.js";

const router = new Router();

router.route("/addProduct").post(
    [
        body("items.*.quantity").isInt().withMessage("Quantity must be an Integer"),
        body("items.*.price").isFloat({min:0}).withMessage("Price must be a non negative float "),
        body("totalPrice").isFloat({min:0}).withMessage("Total Price must be a non negative float ")
    ],    
    authenticate,
    validateRequest,
    addProductToCart
);

router.route("/removeProduct/:id").delete(authenticate,removeProductFromCart);
router.route("/updateProductQte").patch(authenticate,updateProductQuantity);
router.route("/viewSummary/:id").get(authenticate,viewCartSummary);
router.route("/create").post(authenticate,createCart)

export default router;