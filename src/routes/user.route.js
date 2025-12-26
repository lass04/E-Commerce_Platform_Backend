import Router from "express";
import { createUser, deleteUser, updateUser, getUsers , loginUser , logoutUser , refreshUserToken }
from "../controllers/user.controller.js";

const router = new Router();

// Defining User CRUD Routes

router.route("/create").post(createUser);
router.route("/delete").delete(deleteUser);
router.route("/update").patch(updateUser);
router.route("/create").get(getUsers);

// User Auth Routes

router.route("/login").post(loginUser);
router.route("/refresh").post(refreshUserToken);
router.route("/logout").post(logoutUser);

export default router;