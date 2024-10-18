import { ClientSession } from "./client-session.js";
import { JsonObjectId } from "./json-object-id.js";

export type ServerSession = {
  userId: JsonObjectId;
  clientSession: ClientSession;
};
