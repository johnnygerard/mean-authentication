import express from "express";
import { register } from "../controllers/register.js";
import { login } from "../controllers/login.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

export default router;
