import { faker } from "@faker-js/faker";
import {
  CONFLICT,
  CREATED,
} from "../../../server/src/constants/http-status-code";

const REGISTER = "/register";

describe("The registration page", () => {
  beforeEach(() => {
    const username = faker.internet.userName();
    cy.wrap(username).as("username");
    registerNewUser(username, faker.internet.password());
  });

  it("should register a new user", () => {});

  it("should redirect after registration", () => {
    cy.location("pathname").should("eq", "/");
  });

  it("should create a session after registration", function () {
    cy.getByData("logout-button").should("exist");
    cy.contains(this["username"]);
  });

  it("should block navigation when logged in", () => {
    cy.visit(REGISTER);
    cy.location("pathname").should("not.eq", REGISTER);
  });

  it("should not register an existing user", function () {
    cy.getByData("logout-button").click();
    cy.visit(REGISTER);
    cy.intercept("POST", "/api/account").as("register");

    // Fill out and submit the form
    cy.getByData("register-form").within(() => {
      cy.getByData("username").type(this["username"]);
      cy.getByData("password").type(faker.internet.password());
      cy.root().submit();
    });

    cy.wait("@register").its("response.statusCode").should("eq", CONFLICT);
  });
});

const registerNewUser = (username: string, password: string): void => {
  cy.visit(REGISTER);
  cy.intercept("POST", "/api/account").as("register");

  // Fill out and submit the form
  cy.getByData("register-form").within(() => {
    cy.getByData("username").type(username);
    cy.getByData("password").type(password);
    cy.root().submit();
  });

  cy.wait("@register").its("response.statusCode").should("eq", CREATED);
};
