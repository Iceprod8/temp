/*
 * InPlan models page tests
 */

describe("models", () => {
  beforeEach(() => {
    cy.resetdb();
    cy.login();
  });

  it("batch_creation", () => {
    cy.get("[data-test=page_models]").click();
    cy.get("[data-test=print_patient]").contains("Add the 2 models");
    cy.get("[data-test=print_patient]").click();
    cy.get("[data-test=create_batch]").contains("Print 2 models");
    cy.get("[data-test=create_batch]").click();
    cy.get("[data-test=batch_modify]").click();
    cy.get("[data-test=batch_modified]").click();
  });
});
