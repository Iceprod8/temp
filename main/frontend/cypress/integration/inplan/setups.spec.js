/*
 * InPlan dashboard setup page
 */

describe("setups", () => {
  beforeEach(() => {
    cy.resetdb();
    cy.login();
  });

  it("add_remove_archive", () => {
    cy.getPatientRow("test_model")
      .find("[data-test=link_patient_dashboard]")
      .first()
      .click();

    cy.get("[data-test=setups]").click();

    /* Delete */

    cy.get("[data-field=name][role=cell]").should("have.length", 1);

    cy.get("[data-test=submit-order]").find("[data-test=submit]").click();

    cy.get("[data-field=name][role=cell]").should("have.length", 2);

    cy.get("[data-field=actions][role=cell]")
      .eq(1)
      .find("button")
      .first()
      .click();

    cy.get("[data-field=name][role=cell]").should("have.length", 1);

    /* Archive */

    cy.get("[data-test=submit-order]").find("[data-test=submit]").click();

    cy.get("[data-field=name][role=cell]").should("have.length", 2);

    cy.get("[data-field=actions][role=cell]")
      .eq(1)
      .find("button")
      .eq(1)
      .click();

    cy.get("[data-field=name][role=cell]").should("have.length", 1);

    /* Upload */

    cy.get("[data-test=submit-order]").find("[data-test=submit]").click();

    cy.get("[data-field=name][role=cell]").should("have.length", 2);

    cy.get("[data-field=actions][role=cell]")
      .eq(1)
      .find("button")
      .eq(2)
      .click();

    cy.get("[data-test=uploadMenu]").find("[data-test=original]").click();

    cy.get("[data-test=hiddenUploadInput]").then((subject) => {
      cy.fixture("ABIBULA__Etape_0_de_10_Superieur.stl", "binary")
        .then(Cypress.Blob.binaryStringToBlob)
        .then((blob) => {
          const el = subject[0];
          const testFile = new File(
            [blob],
            "ABIBULA__Etape_0_de_10_Superieur.stl",
            {
              type: "Meshmixer Document",
            }
          );
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(testFile);
          el.files = dataTransfer.files;
          el.dispatchEvent(new Event("change", { bubbles: true }));

          cy.get(".notification-container")
            .find(".message", { timeout: 50000 })
            .should(($message) => {
              expect($message.text()).to.equal(
                "ABIBULA__Etape_0_de_10_Superieur.stl downloaded"
              );
            });
        });
    });
  });
});
