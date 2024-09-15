import express from "express";
import { readAccount } from "../controllers/read-account.js";
import { deleteSession } from "../controllers/delete-session.js";

const router = express.Router();

router.get("/account", readAccount);
router.delete("/session", deleteSession);

export default router;
