/*
 * InPlan dashboard appointment page
 */

describe("setups", () => {
  beforeEach(() => {
    cy.resetdb();
    cy.login();
  });

  it("add", () => {
    cy.getPatientRow("test_model")
      .find("[data-test=link_patient_dashboard]")
      .first()
      .click();

    cy.get("[data-test=appointment]").click();

    cy.get("[data-field=data][role=cell]").should("have.length", 0);

    cy.get("[data-test=appointmentDate]")
      .find("input")
      .clear()
      .type("02/16/2022 10:50{enter}");

    cy.get("[data-test=submit-order]").find("[data-test=submit]").click();

    cy.get("[data-field=date][role=cell]").should("have.length", 1);
  });
});
