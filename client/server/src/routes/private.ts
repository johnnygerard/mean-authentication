import express from "express";
import { readAccount } from "../controllers/read-account.js";

const router = express.Router();

router.get("/account", readAccount);

export default router;
