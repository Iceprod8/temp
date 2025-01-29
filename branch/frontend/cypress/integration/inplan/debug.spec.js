/*
 * InPlan verify debug mode
 */

describe("debug", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("is_debug", () => {
    cy.get("[data-name=debug]").should("have.text", "true");
  });
});
