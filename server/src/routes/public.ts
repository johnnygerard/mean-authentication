import express from "express";
import { createAccount } from "../controllers/create-account.js";
import { login } from "../controllers/login.js";
import { deleteSession } from "../controllers/delete-session.js";
import { authStatus } from "../controllers/auth-status.js";

const router = express.Router();

router.get("/auth-status", authStatus);
router.post("/login", login);
router.delete("/session", deleteSession);
router.post("/account", createAccount);

export default router;
