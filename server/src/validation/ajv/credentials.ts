import type { JTDSchemaType } from "ajv/dist/types/jtd-schema.js";
import { Credentials } from "../../types/credentials.js";
import { ajv } from "./index.js";

const schema: JTDSchemaType<Credentials> = {
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
  additionalProperties: false,
};

export const parseCredentials = ajv.compileParser(schema);
