import Router from "express";
import { addProductToCart, updateProductQuantity , removeProductFromCart , viewCartSummary } 
from "../controllers/cart.controller.js";

const router = new Router();

router.route("/addProduct").post(addProductToCart);
router.route("/removeProduct").delete(removeProductFromCart);
router.route("/updateProductQte").patch(updateProductQuantity);
router.route("/viewSummary").get(viewCartSummary);

export default router;