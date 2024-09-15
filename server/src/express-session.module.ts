import { ClientSession } from "./types/client-session.js";

declare module "express-session" {
  // noinspection JSUnusedGlobalSymbols
  interface SessionData {
    user: {
      _id: string; // JSON-serialized ObjectId
      clientSession: ClientSession;
    };
  }
}
