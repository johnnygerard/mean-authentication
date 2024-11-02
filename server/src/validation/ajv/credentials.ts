import type { JTDSchemaType } from "ajv/dist/types/jtd-schema.js";
import { ajv } from "./index.js";

export type Credentials = {
  username: string;
  password: string;
};

const schema: JTDSchemaType<Credentials> = {
  properties: {
    username: { type: "string" },
    password: { type: "string" },
  },
  additionalProperties: false,
};

export const parseCredentials = ajv.compileParser(schema);
