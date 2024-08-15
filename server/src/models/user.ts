import { randomUUID } from "node:crypto";

export class User {
  // UUIDv4 (See https://www.rfc-editor.org/rfc/rfc9562#name-uuid-version-4)
  readonly id = randomUUID();
  readonly createdAt = new Date();

  constructor(
    public username: string,
    public password: string,
  ) {}
}
