import express from "express";
import ms from "ms";
import { deleteSession } from "../controllers/delete-session.js";
import { readAccount } from "../controllers/read-account.js";
import { rateLimiter } from "../middleware/rate-limiter.js";

const router = express.Router();

router.get("/account", rateLimiter(10, ms("1 minute")), readAccount);
router.delete("/session", deleteSession);

export default router;
