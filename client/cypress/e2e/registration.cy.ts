import { faker } from "@faker-js/faker";
import { CREATED } from "../../../server/src/http-status-code";

describe("Register page", () => {
  it("should register a new user", () => {
    registerNewUser(faker.internet.userName(), faker.internet.password());
  });
});

export const registerNewUser = (username: string, password: string): void => {
  cy.visit("/register");
  cy.intercept("POST", "/api/account").as("register");

  // Fill out and submit the form
  cy.getByData("register-form").within(() => {
    cy.getByData("username").type(username);
    cy.getByData("password").type(password);
    cy.root().submit();
  });

  cy.wait("@register").its("response.statusCode").should("eq", CREATED);
  cy.location("pathname").should("eq", "/");
  cy.contains(username);
};
