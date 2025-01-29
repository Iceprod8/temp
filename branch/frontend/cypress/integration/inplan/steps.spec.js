/*
 * InPlan check patient address
 */

describe("patients", () => {
  beforeEach(() => {
    cy.resetdb();
    cy.login();
  });

  it("remove_step", () => {
    cy.getPatientRow("test_model")
      .find("[data-test=link_patient_dashboard]")
      .first()
      .click();

    cy.get("[data-test=new_period_btn]").click();
    cy.get("[name=start_date]").type("2222-12-01");
    cy.get("[data-test=create_periode_submit]").click();
    cy.get("[data-test=delete-step]").should("have.length", 2);
    cy.get("[data-test=delete-step]").last().click();
    cy.get("[data-test=period-name-todelete]").type("Period 2");
    cy.get("[data-test=confirm-delete-period]").click();
    cy.get("[data-test=delete-step]").should("have.length", 1);
  });
});
