import Router from "express";
import { createUser, deleteUser, updateUser, getUsers } from "../controllers/user.controller.js";

const router = new Router();

// Defining User Routes

router.route("/createUser").post(createUser);
router.route("/deleteUser").delete(deleteUser);
router.route("/updateUser").patch(updateUser);
router.route("/createUser").get(getUsers);

export default router;