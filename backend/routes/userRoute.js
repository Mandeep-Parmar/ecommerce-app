import express from "express";
import { adminLogin, loginUser, registerUser, verifyOTP } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);
userRouter.post("/verify-otp", verifyOTP);

export default userRouter;