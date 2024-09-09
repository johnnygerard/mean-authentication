import { ClientSession } from "./types/client-session.js";
import { ObjectId } from "mongodb";

declare module "express-session" {
  // noinspection JSUnusedGlobalSymbols
  interface SessionData {
    user: {
      _id: ObjectId;
      clientSession: ClientSession;
    };
  }
}
