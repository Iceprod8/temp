// Cypress.on("uncaught:exception", () => false);

describe("orders", () => {
  beforeEach(() => {
    cy.resetdb();
    cy.login();
  });

  it("create_new_order", () => {
    cy.getPatientRow("Moreau")
      .find("[data-test=link_patient_dashboard]")
      .first()
      .click();

    cy.get("[data-test=orders]").click();

    cy.request({
      url: "http://localhost:8000/api/1/orders",
      method: "GET",
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
      .its("body.results")
      .should("have.length", 27);

    cy.get("[data-test=type]").click();
    cy.get("[data-test=selectfield-item").contains("Setup").click();

    cy.get("[data-test=deadline_type]").click();
    cy.get("[data-test=selectfield-item]").contains("today").click();

    cy.get("[data-test=submit]").click();
    cy.get(".message").should(($message) => {
      expect($message.text()).to.equal("Order was created");
    });
    cy.request({
      url: "http://localhost:8000/api/1/orders",
      method: "GET",
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    })
      .its("body.results")
      .should("have.length", 28);
  });

  it("create_new_order_bad_aligner_input", () => {
    cy.getPatientRow("Moreau")
      .find("[data-test=link_patient_dashboard]")
      .first()
      .click();

    cy.get("[data-test=orders]").click();

    cy.get("[data-test=type]").parent().click();
    cy.get("[data-test=selectfield-item]").parent().contains("Aligner").click();

    cy.get("[data-test=setup]").parent().click();
    cy.get("[data-test=selectfield-item]").parent().contains("Setup 1").click();

    cy.get("[data-test=pickup_location]").parent().click();
    cy.get("[data-test=selectfield-item]").parent().contains("clinic").click();

    cy.get("[data-test=deadline_type]").parent().click();
    cy.get("[data-test=selectfield-item]").parent().contains("today").click();

    cy.get("[data-test=upper_lower_switch]").click();
    cy.get("[data-test=start_aligner_top]").type("a");
    cy.get("[data-test=start_aligner_top]").type(0);
    cy.get("[data-test=start_aligner_top]").should("have.value", 0);

    cy.get("[name=end_aligner_bottom]").type("a");
    cy.get("[name=end_aligner_bottom]").type(0);
    cy.get("[name=end_aligner_bottom]").should("have.value", 0);

    cy.get("[data-test=submit]").click();
  });
});
