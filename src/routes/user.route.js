import Router from "express";
import { createUser, deleteUser, updateUser, getUsers , loginUser , logoutUser , refreshUserToken }
from "../controllers/user.controller.js";
import { check } from "express-validator";
import validateRequest from "../middlewares/reqValidation.middleware.js";

const router = new Router();

// Defining User CRUD Routes

router.route("/create").post(
    [
        check('email').isEmail().withMessage("Wrong email format"),
        check('phoneNumber').isNumeric().isLength({min:8,max:8}).withMessage("Wrong phoneNumber Input"),
        check('password').isLength({min:8}).withMessage("Password is minimum 8 characters"),
        check('nom').trim().isLength({min:5,max:15}).withMessage("nom length must be between 5 & 15"),
        check('prenom').trim().isLength({min:5,max:15}).withMessage("prenom length must be between 5 & 15")
    ],
    validateRequest,
    createUser
);


router.route("/delete/:id").delete(deleteUser);
router.route("/update/:id").patch(updateUser);
router.route("/get").get(getUsers);

// User Auth Routes

router.route("/login").post(loginUser);
router.route("/refresh").post(refreshUserToken);
router.route("/logout").post(logoutUser);

export default router;