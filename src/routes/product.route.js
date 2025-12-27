import Router from "express";
import { createProduct, deleteProduct , updateProduct , getProducts , insertManyProducts ,
 getProductsRating , deleteReviewFromProduct , addReviewToProduct }
from "../controllers/product.controller.js";
import { adminOnly , authenticate } from "../middlewares/auth.middleware.js";

const router = new Router();

router.route("/create").post(adminOnly,createProduct);
router.route("/delete/:id").delete(adminOnly,deleteProduct);
router.route("/update/:id").patch(adminOnly,updateProduct);
router.route("/get").get(authenticate,getProducts);
router.route("/insertMany").post(adminOnly,insertManyProducts);
router.route("/getRatings").get(authenticate,getProductsRating);
router.route("/deleteReview/:id").delete(adminOnly,deleteReviewFromProduct);
router.route("/addReview/:id").post(authenticate,addReviewToProduct);

export default router;