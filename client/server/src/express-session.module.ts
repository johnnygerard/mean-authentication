import { SessionUser } from "./types/session-user";

declare module "express-session" {
  interface SessionData {
    user: SessionUser;
  }
}
