/*
 * InPlan read default fixture data
 */

describe("read", () => {
  beforeEach(() => {
    cy.resetdb();
    cy.login();
  });

  it("read_step", () => {
    cy.getPatientRow("Moreau")
      .find("[data-test=link_patient_dashboard]")
      .first()
      .click();

    cy.get("[data-test=step_card]").first().click();
    cy.get("[data-test=informations]").click();
  });
});
