import express from "express";
import ms from "ms";
import { deleteAllOtherSessions } from "../controllers/delete-all-other-sessions.js";
import { deleteAllSessions } from "../controllers/delete-all-sessions.js";
import { deleteSession } from "../controllers/delete-session.js";
import { readAccount } from "../controllers/read-account.js";
import { readAllSessions } from "../controllers/read-all-sessions.js";
import { rateLimiter } from "../middleware/rate-limiter.js";

const router = express.Router();

router.get("/account", rateLimiter(10, ms("1 minute")), readAccount);
router.get("/all-sessions", readAllSessions);
router.delete("/session", deleteSession);
router.delete("/all-sessions", deleteAllSessions);
router.delete("/all-other-sessions", deleteAllOtherSessions);

export default router;
