import { faker } from "@faker-js/faker";
import { CREATED } from "../../server/src/http-status-code";

describe("User registration", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("should register a new user", () => {
    cy.getByData("register-form").within(($form) => {
      // Fill out and submit the form
      cy.getByData("username").type(faker.internet.userName());
      cy.getByData("password").type(faker.internet.password());
      cy.intercept("POST", "/api/account").as("register");
      cy.root().submit();

      cy.wait("@register").its("response.statusCode").should("equal", CREATED);
      cy.location("pathname").should("equal", "/");
    });
  });
});
