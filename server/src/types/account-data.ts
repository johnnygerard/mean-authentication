import { User } from "../models/user.js";

export type AccountData = Omit<User, "password">;
