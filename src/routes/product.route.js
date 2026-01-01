import Router from "express";
import { createProduct, deleteProduct , updateProduct , getProducts , insertManyProducts ,
 getProductsRating , deleteReviewFromProduct , addReviewToProduct }
from "../controllers/product.controller.js";
import { adminOnly , authenticate } from "../middlewares/auth.middleware.js";
import { body } from "express-validator";
import validateRequest from "../middlewares/reqValidation.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = new Router();

router.route("/create").post(
    [
        body("price").isFloat({min:0}).withMessage("Price must be a non negative float "),
        body("stockQuantity").isInt().withMessage("Stock Quantity must be an integer"),
        body("reviews.*.rating").isFloat({min:0,max:5}).withMessage("Rating must be between 0 & 5"),
        body("status").isLength({min:4,max:9}).withMessage("Status must be one of [pending,paid,shipped,delivered]")
    ],
    adminOnly,
    upload.single("image"),
    validateRequest,
    createProduct
);

router.route("/delete/:id").delete(adminOnly,deleteProduct);

router.route("/update/:id").patch(adminOnly,updateProduct);

router.route("/get").get(authenticate,getProducts);

router.route("/insertMany").post(adminOnly,insertManyProducts);

router.route("/getRatings").get(authenticate,getProductsRating);

router.route("/deleteReview/:id").delete(adminOnly,deleteReviewFromProduct);

router.route("/addReview/:id").post(
    [
        body("rating").isFloat({min:0,max:5}).withMessage("Rating must be between 0 and 5"),
    ],    
    authenticate,
    validateRequest,
    addReviewToProduct
);

export default router;