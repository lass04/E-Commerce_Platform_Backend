import Router from "express";
import { addProductToCart, updateProductQuantity , removeProductFromCart , viewCartSummary , createCart } 
from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = new Router();

router.route("/addProduct").post(authenticate,addProductToCart);
router.route("/removeProduct/:id").delete(authenticate,removeProductFromCart);
router.route("/updateProductQte").patch(authenticate,updateProductQuantity);
router.route("/viewSummary").get(authenticate,viewCartSummary);
router.route("/create").post(authenticate,createCart)

export default router;