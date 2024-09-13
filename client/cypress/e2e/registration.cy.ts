import { faker } from "@faker-js/faker";
import { CREATED } from "../../../server/src/http-status-code";

describe("Register page", () => {
  it("should register a new user", () => {
    const username = faker.internet.userName();
    cy.visit("/register");
    cy.intercept("POST", "/api/account").as("register");

    // Fill out and submit the form
    cy.getByData("register-form").within(() => {
      cy.getByData("username").type(username);
      cy.getByData("password").type(faker.internet.password());
      cy.root().submit();
    });

    cy.wait("@register").its("response.statusCode").should("eq", CREATED);
    cy.location("pathname").should("eq", "/");
    cy.contains(username);
  });
});
