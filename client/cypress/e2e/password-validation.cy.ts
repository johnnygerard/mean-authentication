import { faker } from "@faker-js/faker";
import { PASSWORD_MAX_LENGTH } from "../../../server/src/constants/password";

describe("The password form control", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("should require a password", () => {
    cy.getByData("register-form").within(() => {
      cy.getByData("username").type(faker.internet.userName());
      cy.root().submit();

      cy.getByData("password").should("have.class", "ng-invalid");
    });
  });

  it("should truncate the password to the maximum length", () => {
    const password = faker.internet.password({
      length: PASSWORD_MAX_LENGTH + 1,
    });

    cy.getByData("register-form").within(() => {
      cy.getByData("username").type(faker.internet.userName());
      cy.getByData("password").type(password);

      cy.getByData("password").should(
        "have.prop",
        "value",
        password.slice(0, PASSWORD_MAX_LENGTH),
      );
    });
  });

  it("should validate the password strength", () => {
    const username = faker.internet.userName();
    const weakPassword = `${username}123`;
    const strongPassword = faker.internet.password({ length: 20 });

    cy.getByData("register-form").within(() => {
      cy.getByData("username").type(username);
      cy.getByData("password").type(weakPassword);

      cy.root().should("have.class", "ng-invalid");

      cy.getByData("password").clear();
      cy.getByData("password").type(strongPassword);

      cy.root().should("have.class", "ng-valid");
    });
  });
});
