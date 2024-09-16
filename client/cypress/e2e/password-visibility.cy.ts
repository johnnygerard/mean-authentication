import { faker } from "@faker-js/faker";

describe("The password visibility button", () => {
  it("should toggle the password visibility", () => {
    const password = faker.internet.password();

    cy.visit("/register");
    cy.getByData("register-form").within(() => {
      cy.getByData("password").type(password);

      // Assert initial state
      cy.getByData("password").should("have.attr", "type", "password");
      cy.getByData("password").should("have.focus");

      cy.getByData("password-visibility").click();
      cy.getByData("password-visibility").should("have.focus");
      cy.getByData("password").should("have.attr", "type", "text");

      cy.getByData("password-visibility").click();
      cy.getByData("password-visibility").should("have.focus");
      cy.getByData("password").should("have.attr", "type", "password");
    });
  });
});
