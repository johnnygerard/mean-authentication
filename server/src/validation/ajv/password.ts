import { JTDSchemaType } from "ajv/dist/types/jtd-schema.js";
import { ajv } from "./index.js";

const schema: JTDSchemaType<{ password: string }> = {
  properties: {
    password: { type: "string" },
  },
  additionalProperties: false,
};

export const parsePassword = ajv.compileParser(schema);
