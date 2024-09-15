import express from "express";
import { createAccount } from "../controllers/create-account.js";
import { createSession } from "../controllers/create-session.js";
import { rateLimiter } from "../middleware/rate-limiter.js";
import ms from "ms";

const router = express.Router();
const authRateLimiter = rateLimiter(5, ms("1m"));

router.post("/account", authRateLimiter, createAccount);
router.post("/session", authRateLimiter, createSession);

export default router;
