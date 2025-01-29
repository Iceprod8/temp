/*
 * InPlan Notes tests
 */

describe("notes", () => {
  beforeEach(() => {
    cy.resetdb();
    cy.login();
  });

  it("add_step_note", () => {
    cy.getPatientRow("Moreau")
      .find("[data-test=link_patient_dashboard]")
      .first()
      .click();

    cy.get("[data-test=step_card]").first().click();
    cy.get("[data-test=informations]").click();
    cy.get("[data-test=add_note]").click();
    cy.get("[data-test=note_title]").type("Note title");
    cy.get("[data-test=note_body]").type("Note body");
    cy.get("[data-test=note_confirm]").click();
    cy.get("[data-test=patient_nav_link]").click();

    cy.getPatientRow("Moreau").find("[title='Show Name']").click();

    cy.get("[data-test=notes]").should("have.length", 1);
  });

  it("add_empty_step_note", () => {
    cy.getPatientRow("Moreau")
      .find("[data-test=link_patient_dashboard]")
      .first()
      .click();

    cy.get("[data-test=step_card]").first().click();
    cy.get("[data-test=informations]").click();
    cy.get("[data-test=add_note]").click();
    cy.get("[data-test=note_title]").type("Note title");
    cy.get("[data-test=note_confirm]").click();
    cy.get("[data-test=patient_nav_link]").click();

    cy.getPatientRow("Moreau").find("[title='Show Name']").click();

    cy.get("[data-test=notes]").should("have.length", 1);
  });
});
