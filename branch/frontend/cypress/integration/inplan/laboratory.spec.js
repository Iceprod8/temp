describe("laboratory", () => {
  beforeEach(() => {
    cy.resetdb();
    cy.login();
  });

  it("check_buttons", () => {
    cy.get("[data-test=laboratory_page]").click();
    cy.get("[data-test=validate]").should("be.disabled");
    cy.get("[data-test=launch-printing]").should("be.enabled");
    cy.get("[data-field=type][data-test=cell-lab]").as("typesCell");
    cy.get("@typesCell").should("have.length", 3);
    // Do not use alias because the click does not retry
    // very weird from cypress
    cy.get("[data-field=type][data-test=cell-lab]").contains("Setup").click();
    cy.get("[data-test=validate]").should("be.enabled");
    cy.get("[data-field=type][data-test=cell-lab]").contains("Setup").click();
  });

  it("type_filter", () => {
    cy.get("[data-test=laboratory_page]").click();

    cy.get("[data-field=type][role=columnheader]").as("header");
    // Sort
    cy.get("@header").click();

    cy.get("[data-test=row-lab]").should("not.have.length", 0);

    // Get the menu for the column

    cy.get("[data-test=showFilter]").click({ force: true });

    // Add a filter
    cy.get("select[placeholder='Filter value']").as("filterInput");

    cy.get("@filterInput").select("Setup");

    // wait because filtering is asynchronous
    // Check
    cy.get("[data-test=row-lab]").should("have.length", 1);

    // Change filter
    cy.get("@filterInput").select("Aligner");

    cy.get("[data-test=row-lab]").should("have.length", 2);
  });
});
