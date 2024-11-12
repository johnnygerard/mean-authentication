import express from "express";
import ms from "ms";
import { deleteAccount } from "../controllers/delete-account.js";
import { deleteAllOtherSessions } from "../controllers/delete-all-other-sessions.js";
import { deleteAllSessions } from "../controllers/delete-all-sessions.js";
import { deleteSession } from "../controllers/delete-session.js";
import { readAccount } from "../controllers/read-account.js";
import { readAllSessions } from "../controllers/read-all-sessions.js";
import { updatePassword } from "../controllers/update-password.js";
import { rateLimiter } from "../middleware/rate-limiter.js";

const router = express.Router();

router.get("/account", rateLimiter(10, ms("1 minute")), readAccount);
router.get("/all-sessions", rateLimiter(10, ms("1 minute")), readAllSessions);
router.delete("/session", deleteSession);
router.delete("/all-sessions", deleteAllSessions);
router.put("/password", rateLimiter(10, ms("1 minute")), updatePassword);

router.delete(
  "/all-other-sessions",
  rateLimiter(10, ms("1 minute")),
  deleteAllOtherSessions,
);

router.delete(
  "/account",
  rateLimiter(10, ms("1 minute")),
  deleteAccount,
  deleteAllSessions,
);

export default router;
