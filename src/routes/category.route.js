import Router from "express";
import { createCategory,deleteCategory,updateCategory,getCategories,insertManyCategories}
from "../controllers/category.controller.js";
import { adminOnly } from "../middlewares/auth.middleware.js";

const router = new Router();

router.route("/createCategory").post(adminOnly,createCategory);
router.route("/deleteCategory").delete(adminOnly,deleteCategory);
router.route("/updateCategory").patch(adminOnly,updateCategory);
router.route("/getCategories").get(adminOnly,getCategories);
router.route("/insertManyCategories").post(adminOnly,insertManyCategories);

export default router;