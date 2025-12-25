import Router from "express";
import { createProduct, deleteProduct , updateProduct , getProducts } from "../controllers/product.controller.js";

const router = new Router();

router.route("/createProduct").post(createProduct);
router.route("/deleteProduct").delete(deleteProduct);
router.route("/updateProduct").patch(updateProduct);
router.route("/getProducts").get(getProducts);

export default router;