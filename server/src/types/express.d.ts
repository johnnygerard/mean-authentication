import { ServerSession } from "./server-session.js";

declare module "express-serve-static-core" {
  interface Request {
    session: ServerSession | null | undefined;
  }
}
