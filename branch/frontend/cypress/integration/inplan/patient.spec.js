/*
 * InPlan check patient address
 */

// import cy from "date-fns/esm/locale/cy/index.js";

Cypress.on("uncaught:exception", () => false);

describe("patients", () => {
  beforeEach(() => {
    cy.resetdb();
    cy.login();
  });

  it("has_profile", () => {
    cy.get("[data-test=link_patient_dashboard]").first().click();
    cy.get("[data-test=patient_profile]").click();
  });

  it("add_note", () => {
    cy.getPatientRow("Moreau")
      .find("[data-test=link_patient_dashboard]")
      .first()
      .click();

    cy.get("[data-test=patient_profile]").click();

    cy.get("[data-test=add_note]").click();
    cy.get("[data-test=note_title]").type("title test");
    cy.get("[data-test=note_body]").type("body test");
    cy.get("[data-test=note_confirm]").click();
    cy.wait(5000); // In very busy server, the notes is not created yet
    cy.request({
      url: "http://localhost:8000/api/1/notes",
      method: "GET",
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    }).then((res) => {
      cy.wrap(res.body.results).should("have.length", 1);
      cy.get("[data-test=new_note]").should("have.length", 1);
      cy.get("[data-test=new_note]")
        .children()
        .eq(1)
        .should("have.text", "title test");
      cy.get("[data-test=new_note]")
        .children()
        .eq(2)
        .should("have.text", "body test");
    });
  });
});
