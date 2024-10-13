import { ClientSession } from "./types/client-session.js";

declare module "express-session" {
  // noinspection JSUnusedGlobalSymbols
  interface SessionData {
    user: {
      // User ID stored as a JSON-serialized ObjectId
      _id: string;
      clientSession: ClientSession;
    };
  }
}
