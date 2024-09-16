import { faker } from "@faker-js/faker";
import { CREATED, UNAUTHORIZED } from "../../../server/src/http-status-code";

describe("The login page", () => {
  // Create a reusable user account
  before(() => {
    const username = faker.internet.userName();
    const password = faker.internet.password();

    cy.wrap(username).as("username");
    cy.wrap(password).as("password");
    cy.visit("/register");
    cy.intercept("POST", "/api/account").as("register");

    // Fill out and submit the form
    cy.getByData("register-form").within(() => {
      cy.getByData("username").type(username);
      cy.getByData("password").type(password);
      cy.root().submit();
    });

    cy.wait("@register").its("response.statusCode").should("eq", CREATED);
    cy.getByData("logout-button").click();
  });

  beforeEach(() => {
    cy.visit("/sign-in");
    cy.intercept("POST", "/api/session").as("login");
  });

  it("should log in an existing user", function () {
    logInUser(this["username"], this["password"]);

    cy.wait("@login").its("response.statusCode").should("eq", CREATED);
    cy.contains(this["username"]);
    cy.getByData("logout-button").should("exist");
  });

  it("should redirect after logging in", function () {
    logInUser(this["username"], this["password"]);
    cy.wait("@login").its("response.statusCode").should("eq", CREATED);

    cy.location("pathname").should("eq", "/");
  });

  it("should maintain the user's session after a page reload", function () {
    logInUser(this["username"], this["password"]);
    cy.wait("@login").its("response.statusCode").should("eq", CREATED);

    cy.reload();
    cy.contains(this["username"]);
    cy.getByData("logout-button").should("exist");
  });

  it("should not log in a nonexistent user", () => {
    logInUser(faker.internet.userName(), faker.internet.password());
    cy.wait("@login").its("response.statusCode").should("eq", UNAUTHORIZED);
  });

  it("should not log in a user with an incorrect password", function () {
    logInUser(this["username"], faker.internet.password());
    cy.wait("@login").its("response.statusCode").should("eq", UNAUTHORIZED);
  });
});

const logInUser = (username: string, password: string): void => {
  cy.getByData("login-form").within(() => {
    cy.getByData("username").type(username);
    cy.getByData("password").type(password);
    cy.root().submit();
  });
};
