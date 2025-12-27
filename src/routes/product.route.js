import Router from "express";
import { createProduct, deleteProduct , updateProduct , getProducts , insertManyProducts }
from "../controllers/product.controller.js";
import { adminOnly , authenticate } from "../middlewares/auth.middleware.js";

const router = new Router();

router.route("/create").post(adminOnly,createProduct);
router.route("/delete/:id").delete(adminOnly,deleteProduct);
router.route("/update/:id").patch(adminOnly,updateProduct);
router.route("/get").get(authenticate,getProducts);
router.route("/insertMany").post(adminOnly,insertManyProducts);

export default router;