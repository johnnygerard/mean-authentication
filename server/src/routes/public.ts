import express from "express";
import { createAccount } from "../controllers/create-account.js";
import { login } from "../controllers/login.js";
import { logout } from "../controllers/logout.js";
import { authStatus } from "../controllers/auth-status.js";

const router = express.Router();

router.get("/auth-status", authStatus);
router.post("/login", login);
router.post("/logout", logout);
router.post("/account", createAccount);

export default router;
