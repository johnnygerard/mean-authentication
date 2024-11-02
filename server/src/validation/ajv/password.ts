import { JTDSchemaType } from "ajv/dist/types/jtd-schema.js";
import { PASSWORD_MAX_LENGTH } from "../../constants/password.js";
import { ajv } from "./index.js";

type Password = { password: string };

const schema: JTDSchemaType<Password> = {
  properties: {
    password: { type: "string" },
  },
  additionalProperties: false,
};

const parse = ajv.compileParser(schema);

export const parsePassword = (json: string): Password | undefined => {
  const credentials = parse(json);

  if (credentials && credentials.password.length <= PASSWORD_MAX_LENGTH)
    return credentials;
};
