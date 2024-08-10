import { Buffer } from "node:buffer";
import { faker } from "@faker-js/faker";
import { createJwt, validateJwt } from "./session.js";
import jwt from "jsonwebtoken";

describe("session module", () => {
  let username: string;
  let userId: string;

  beforeEach(() => {
    username = faker.internet.userName();
    userId = faker.string.uuid();
  });

  describe("createJwt function", () => {
    it("should generate a signed JWT for the given user", async () => {
      const token = await createJwt(username, userId);

      expect(token).toMatch(/^(?:\w|-)+(?:\.(\w|-)+){2}$/);
    });
  });

  describe("validateJwt function", () => {
    it("should validate a JWT", async () => {
      const token = await createJwt(username, userId);
      const payload = await validateJwt(token);

      expect(payload.username).toBe(username);
    });

    it("should throw an error if token is expired", async () => {
      jasmine.clock().install();
      const token = await createJwt(username, userId);
      const payload = jwt.decode(token) as jwt.JwtPayload;

      expect(typeof payload.exp).toBe("number");
      jasmine.clock().mockDate(new Date((payload.exp as number) * 1000));

      await expectAsync(validateJwt(token)).toBeRejectedWithError(
        jwt.TokenExpiredError,
      );

      jasmine.clock().uninstall();
    });

    it("should throw an error if token has no signature", async () => {
      const token = await createJwt(username, userId);

      // Set algorithm to "none" and strip the signature
      const payload = token.split(".")[1];
      const badHeader = Buffer.from('{"alg":"none","typ":"JWT"}').toString(
        "base64url",
      );
      const badToken = [badHeader, payload, ""].join(".");

      await expectAsync(validateJwt(badToken)).toBeRejectedWithError(
        jwt.JsonWebTokenError,
      );
    });
  });
});
