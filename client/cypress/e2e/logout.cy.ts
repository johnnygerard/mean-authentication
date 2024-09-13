import { faker } from "@faker-js/faker";
import { CREATED, NO_CONTENT } from "../../../server/src/http-status-code";

describe("Logout button", () => {
  const username = faker.internet.userName();

  before(() => {
    // Register a new user
    cy.visit("/register");
    cy.intercept("POST", "/api/account").as("register");
    cy.getByData("register-form").within(() => {
      cy.getByData("username").type(username);
      cy.getByData("password").type(faker.internet.password());
      cy.root().submit();
    });
    cy.wait("@register").its("response.statusCode").should("eq", CREATED);
  });

  it("should log out the user", () => {
    // Visit a private page
    cy.visit("/account");
    cy.intercept("DELETE", "/api/session").as("logout");

    // Click the logout button
    cy.getByData("logout-button").click();

    cy.wait("@logout").its("response.statusCode").should("eq", NO_CONTENT);
    cy.location("pathname").should("eq", "/");
    cy.getByData("login-link");
    cy.getByData("logout-button").should("not.exist");
  });
});
