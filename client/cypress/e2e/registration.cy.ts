import { faker } from "@faker-js/faker";
import { CONFLICT, CREATED } from "../../../server/src/http-status-code";

const REDIRECT = "/";

describe("Register page", () => {
  it("should register a new user", () => {
    registerNewUser(faker.internet.userName(), faker.internet.password());
  });

  it("should block navigation when logged in", () => {
    registerNewUser(faker.internet.userName(), faker.internet.password());

    cy.visit("/register");
    cy.location("pathname").should("eq", REDIRECT);
  });

  it("should not register an existing user", () => {
    const username = faker.internet.userName();
    registerNewUser(username, faker.internet.password());
    cy.getByData("logout-button").click();

    cy.visit("/register");
    cy.intercept("POST", "/api/account").as("register");

    // Fill out and submit the form
    cy.getByData("register-form").within(() => {
      cy.getByData("username").type(username);
      cy.getByData("password").type(faker.internet.password());
      cy.root().submit();
    });

    cy.wait("@register").its("response.statusCode").should("eq", CONFLICT);
    cy.location("pathname").should("eq", "/register");
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
  cy.location("pathname").should("eq", REDIRECT);
  cy.contains(username);
};
