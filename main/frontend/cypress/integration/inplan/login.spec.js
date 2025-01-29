/*
 * InPlan login/logout tests
 */

const username = "brice";
const password = "forunittest";

describe("inout", () => {
  beforeEach(() => {
    cy.logout();
    cy.resetdb();
    cy.visit("/");
  });

  it("login-click", () => {
    cy.get("[data-name=email]").type(username);
    // {enter} causes the form to submit
    cy.get("[data-name=password]").type(`${password}`);

    cy.get("[data-name=submit]").click();

    cy.url().should("eq", `${Cypress.config().baseUrl}/patients`);

    cy.should(() => {
      expect(localStorage.getItem("token")).to.exist;
    });
  });

  it("login-enter", () => {
    cy.get("[data-name=email]").type(username);
    // {enter} causes the form to submit
    cy.get("[data-name=password]").type(`${password}{enter}`);

    cy.url().should("eq", `${Cypress.config().baseUrl}/patients`);

    cy.should(() => {
      expect(localStorage.getItem("token")).to.exist;
    });
  });

  it("logout", () => {
    cy.login(username, password);

    /* Disable 401 error */
    cy.ignoreUncaught("401");

    cy.get("[data-test=logout]").click();

    cy.url().should("include", "");
  });
});
