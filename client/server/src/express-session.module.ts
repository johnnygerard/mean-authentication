import { SessionUser } from "./types/session-user.js";

declare module "express-session" {
  // noinspection JSUnusedGlobalSymbols
  interface SessionData {
    user: SessionUser;
  }
}
