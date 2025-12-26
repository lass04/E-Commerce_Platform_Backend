import Router from "express";
import { createCategory,deleteCategory,updateCategory,getCategories,insertManyCategories}
from "../controllers/category.controller.js";
import { adminOnly } from "../middlewares/auth.middleware.js";

const router = new Router();

router.route("/create").post(adminOnly,createCategory);
router.route("/delete/:id").delete(adminOnly,deleteCategory);
router.route("/update/:id").patch(adminOnly,updateCategory);
router.route("/get").get(adminOnly,getCategories);
router.route("/insertMany").post(adminOnly,insertManyCategories);

export default router;