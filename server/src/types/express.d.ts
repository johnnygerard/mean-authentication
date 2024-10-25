import { JsonObjectId } from "./json-object-id.js";
import { ServerSession } from "./server-session.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: JsonObjectId;
      session: ServerSession;
      sessionId: string;
    };
  }
}
