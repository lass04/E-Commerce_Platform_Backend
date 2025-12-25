import Router from "express";
import { addProductToCart, updateProductQuantity , removeProductFromCart , viewCartSummary } 
from "../controllers/cart.controller.js";

const router = new Router();

router.route("/createProduct").post(addProductToCart);
router.route("/deleteProduct").delete(removeProductFromCart);
router.route("/updateProduct").patch(updateProductQuantity);
router.route("/getProducts").get(viewCartSummary);

export default router;