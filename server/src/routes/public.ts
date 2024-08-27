import express from "express";
import { createAccount } from "../controllers/create-account.js";
import { createSession } from "../controllers/create-session.js";
import { deleteSession } from "../controllers/delete-session.js";

const router = express.Router();

router.route("/session").post(createSession).delete(deleteSession);
router.post("/account", createAccount);

export default router;
