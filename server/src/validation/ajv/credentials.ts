import type { JTDSchemaType } from "ajv/dist/types/jtd-schema.js";
import { PASSWORD_MAX_LENGTH } from "../../constants/password.js";
import { Credentials } from "../../types/credentials.js";
import { USERNAME_MAX_LENGTH } from "../username.js";
import { ajv } from "./index.js";

const schema: JTDSchemaType<Credentials> = {
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
  additionalProperties: false,
};

const parse = ajv.compileParser(schema);

export const parseCredentials = (json: string): Credentials | undefined => {
  const credentials = parse(json);

  if (
    credentials &&
    credentials.username.length <= USERNAME_MAX_LENGTH &&
    credentials.password.length <= PASSWORD_MAX_LENGTH
  ) {
    return credentials;
  }
};
