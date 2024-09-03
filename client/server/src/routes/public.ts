import express from "express";
import { createAccount } from "../controllers/create-account";
import { createSession } from "../controllers/create-session";
import { deleteSession } from "../controllers/delete-session";
import { rateLimiter } from "../middleware/rate-limiter";
import ms from "ms";

const router = express.Router();
const authRateLimiter = rateLimiter(5, ms("1m"));

router
  .route("/session")
  .post(authRateLimiter, createSession)
  .delete(deleteSession);
router.post("/account", authRateLimiter, createAccount);

export default router;
