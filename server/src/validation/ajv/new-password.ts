import { JTDSchemaType } from "ajv/dist/types/jtd-schema.js";
import { PASSWORD_MAX_LENGTH } from "../../constants/password.js";
import { NewPassword } from "../../types/new-password.js";
import { ajv } from "./index.js";

const schema: JTDSchemaType<NewPassword> = {
  properties: {
    oldPassword: { type: "string" },
    newPassword: { type: "string" },
  },
  additionalProperties: false,
};

const parse = ajv.compileParser(schema);

export const parseNewPassword = (json: string): NewPassword | undefined => {
  const credentials = parse(json);

  if (
    credentials &&
    credentials.oldPassword.length <= PASSWORD_MAX_LENGTH &&
    credentials.newPassword.length <= PASSWORD_MAX_LENGTH
  ) {
    return credentials;
  }
};
