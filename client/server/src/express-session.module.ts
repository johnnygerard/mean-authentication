import { SessionUser } from "./types/session-user.js";

declare module "express-session" {
  interface SessionData {
    user: SessionUser;
  }
}
