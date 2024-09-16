import { faker } from "@faker-js/faker";
import { CREATED, NO_CONTENT } from "../../../server/src/http-status-code";

describe("The logout button", () => {
  const username = faker.internet.userName();
  const password = faker.internet.password();

  // Create a reusable user account
  before(() => {
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
    // Log in the user
    cy.visit("/sign-in");
    cy.intercept("POST", "/api/session").as("login");

    // Fill out and submit the form
    cy.getByData("login-form").within(() => {
      cy.getByData("username").type(username);
      cy.getByData("password").type(password);
      cy.root().submit();
    });

    cy.wait("@login").its("response.statusCode").should("eq", CREATED);

    // Log out the user
    cy.intercept("DELETE", "/api/user/session").as("logout");
    cy.getByData("logout-button").click();
    cy.wait("@logout").its("response.statusCode").should("eq", NO_CONTENT);
  });

  it("should log out the user", () => {
    cy.getByData("logout-button").should("not.exist");

    // Try to access a private route
    cy.visit("/account");
    cy.location("pathname").should("not.eq", "/account");
  });

  it("should redirect the user after logging out", () => {
    cy.location("pathname").should("eq", "/");
  });
});
