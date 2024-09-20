import { faker } from "@faker-js/faker";
import {
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../../../server/src/constants/http-status-code";

// This test should be run separately. To run it:
// - Replace `describe.skip` with `describe`
// - Set DISABLE_RATE_LIMITER to any value other than "true" in the .env file
describe.skip("The rate limiter", () => {
  it("should block requests after the rate limit is exceeded", () => {
    // Simulate a password brute force attack
    cy.visit("/sign-in");
    cy.intercept("POST", "/api/session").as("login");

    cy.getByData("login-form").within(() => {
      cy.getByData("username").type(faker.internet.userName());
    });

    submitLoginForm();
  });
});

const submitLoginForm = (): void => {
  cy.getByData("login-form").within(() => {
    cy.getByData("password").clear().type(faker.internet.password());
    cy.root().submit();
  });

  cy.wait("@login").then((interception) => {
    switch (interception.response?.statusCode) {
      case UNAUTHORIZED:
        submitLoginForm();
        return;
      case TOO_MANY_REQUESTS:
        return;
      default:
        throw new Error("Unexpected response status code");
    }
  });
};
