import express from "express";

// handlers
import { signInHandler, signUpHandler, signOutHandler, refreshTokenHandler } from "../handlers/auth-handlers.js";

const router = express.Router();

// post routes
router.post("/signup", signUpHandler);
router.post("/login", signInHandler);
router.post("/logout", signOutHandler);
router.post("/refresh-token", refreshTokenHandler);

// router.post("/admin-login", userController.loginAdmin);
// router.post("/forgot-password-token", userController.forgotPasswordToken);

// delete routes
// router.delete("/:id", userController.deleteUser);

// update routes
// router.put("/edit-user", authMiddleware, userController.updateUser);
// router.put("/block-user/:id", authMiddleware, isAdmin, userController.blockUser);
// router.put("/unblock-user/:id", authMiddleware, isAdmin, userController.unblockUser);
// router.put("/password", authMiddleware, userController.updatePassword);
// router.put("/reset-password/:token", userController.resetPassword);

export default router;
