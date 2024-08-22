import express from "express";
import { createAccount } from "../controllers/create-account.js";
import { createSession } from "../controllers/create-session.js";
import { deleteSession } from "../controllers/delete-session.js";
import { authStatus } from "../controllers/auth-status.js";

const router = express.Router();

router.get("/auth-status", authStatus);
router.route("/session").post(createSession).delete(deleteSession);
router.post("/account", createAccount);

export default router;
