import express from "express";
import { deleteSession } from "../controllers/delete-session.js";
import { readAccount } from "../controllers/read-account.js";

const router = express.Router();

router.get("/account", readAccount);
router.delete("/session", deleteSession);

export default router;
