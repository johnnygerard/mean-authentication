import { faker } from "@faker-js/faker";
import { NO_CONTENT } from "../../../server/src/http-status-code";
import { registerNewUser } from "./registration.cy";

describe("Logout button", () => {
  before(() => {
    registerNewUser(faker.internet.userName(), faker.internet.password());
  });

  it("should log out the user", () => {
    // Visit a private page
    cy.visit("/account");
    cy.intercept("DELETE", "/api/user/session").as("logout");

    // Click the logout button
    cy.getByData("logout-button").click();

    cy.wait("@logout").its("response.statusCode").should("eq", NO_CONTENT);
    cy.location("pathname").should("eq", "/");
    cy.getByData("login-link");
    cy.getByData("logout-button").should("not.exist");
  });
});
