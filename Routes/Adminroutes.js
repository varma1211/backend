import express from "express";
import { registerAdmin, loginAdmin } from "../Controllers/AdminController.js";
import { authMiddleware } from "../authmiddleware.js ";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Admin authenticated",
    admin: req.user
  });
});

export default router;
