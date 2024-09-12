import { faker } from "@faker-js/faker";
import { CREATED, UNAUTHORIZED } from "../../../server/src/http-status-code";

describe("User authentication flow", () => {
  it("should work", () => {
    const username = faker.internet.userName();
    const password = faker.internet.password();

    // Try to register from the home page
    cy.visit("/");
    cy.getByData("register-link").click();
    cy.intercept("POST", "/api/account").as("register");

    // Try to submit the registration form
    cy.getByData("register-form").within(() => {
      const weakPassword = faker.internet.password({
        length: 8,
        pattern: /[a-z]/,
      });

      cy.getByData("username").type(username);
      cy.getByData("password").type(weakPassword);

      // Assert that the password input is invalid
      cy.getByData("password").should("have.class", "ng-invalid");
      cy.root().submit(); // First attempt should fail

      // User should be on the same page
      cy.location("pathname").should("eq", "/register");

      // Try a strong password
      cy.getByData("password").clear().type(password);
      cy.root().submit();
    });

    cy.wait("@register").its("response.statusCode").should("eq", CREATED);
    cy.location("pathname").should("eq", "/");

    // User's username should be visible on the current page
    cy.contains(username);

    // Reload page and check if the user is still logged in
    cy.reload();
    cy.contains(username);

    // User should not be able to visit the register page
    cy.visit("/register");
    cy.location("pathname").should("eq", "/");

    // Log out
    cy.getByData("logout-button").click();

    // Username should not be visible anymore
    cy.contains(username).should("not.exist");

    // Try to sign in from the home page
    cy.getByData("login-link").click();

    // Try to submit the login form
    cy.intercept("POST", "/api/session").as("login");
    cy.getByData("login-form").within(() => {
      // Attempt to log in with the wrong username
      cy.getByData("username").type(faker.internet.userName());
      cy.getByData("password").type(password);
      cy.root().submit();
      cy.wait("@login").its("response.statusCode").should("eq", UNAUTHORIZED);

      // Attempt to log in with the wrong password
      cy.getByData("username").clear().type(username);
      cy.getByData("password").clear().type(faker.internet.password());
      cy.root().submit();
      cy.wait("@login").its("response.statusCode").should("eq", UNAUTHORIZED);

      // Attempt to log in with the correct credentials
      cy.getByData("password").clear().type(password);
      cy.root().submit();
      cy.location("pathname").should("eq", "/");
      cy.wait("@login").its("response.statusCode").should("eq", CREATED);
    });

    // Visit account page
    cy.getByData("account-link").click();
    cy.location("pathname").should("eq", "/account");

    // Log out
    cy.getByData("logout-button").click();
    cy.location("pathname").should("eq", "/");
  });
});
