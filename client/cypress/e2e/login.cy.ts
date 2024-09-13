import { faker } from "@faker-js/faker";
import { CREATED } from "../../../server/src/http-status-code";

describe("Login page", () => {
  const username = faker.internet.userName();
  const password = faker.internet.password();

  before(() => {
    // Register a new user
    cy.request("POST", "/api/account", { username, password });
  });

  it("should log in an existing user", () => {
    cy.visit("/sign-in");
    cy.intercept("POST", "/api/session").as("login");

    // Fill out and submit the form
    cy.getByData("login-form").within(() => {
      cy.getByData("username").type(username);
      cy.getByData("password").type(password);
      cy.root().submit();
    });

    cy.wait("@login").its("response.statusCode").should("eq", CREATED);
    cy.location("pathname").should("eq", "/");
    cy.contains(username);
  });
});
