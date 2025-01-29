/*
 * InPlan end-2-end tests
 */

describe("basic", () => {
  beforeEach(() => {
    cy.resetdb();
    cy.login();
  });

  it("add_patient", () => {
    cy.get("[data-test=add_patient]").click();

    cy.get("input[name=first_name]").type("antoine");

    cy.get("input[name=last_name]").type("TSINGA");

    cy.get("[data-test=birth_date]").type("2005-05-06");

    cy.get("[data-test=phone_number]").type("0650842056");

    cy.get("[data-test=email]").type("test@test.com");
    cy.get("[data-test=new_patient_submit]").click();
    cy.get("[data-test=link_new_period]").then((x) => {
      const prev = x.length;
      cy.get("[data-test=link_new_period]").should("have.length", prev + 1);
      cy.get("[data-test=link_patient_dashboard]")
        .eq(3)
        .should(($name) => {
          expect($name.text()).to.equal("TSINGA");
        });
    });
  });

  it("start_processing", () => {
    cy.getPatientRow("test_periods")
      .find("[data-test=start_processing]")
      .click();

    cy.url().should("include", "/orders");
  });

  it("upload_models", () => {
    cy.getPatientRow("test_model")
      .find("[data-test=link_patient_dashboard]")
      .first()
      .click();

    cy.get("[data-test=setups]").click();
    cy.get("[role=cell][data-field=name]").should("have.length", 1);

    cy.get("input[name=name]").type("NewSetup{enter}");

    cy.get("[data-test=submit]").click();

    /* Wait submit ends to wait the end of the render for next click */
    cy.get(".message");

    cy.get("[data-test=models]").click();
    cy.get("[data-test=selectSetup]").type("NewSetup{enter}");

    cy.get("[data-test=dropdown-sub-1]").click();
    cy.get("[data-test=model_upload_input]").then((subject) => {
      cy.fixture("ABIBULA__Etape_0_de_10_Superieur.stl", "binary")
        .then(Cypress.Blob.binaryStringToBlob)
        .then((blob) => {
          const el = subject[0];
          const testFile = new File(
            [blob],
            "ABIBULA__Etape_0_de_10_Superieur.stl",
            {
              type: "Meshmixer Document",
            },
          );
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(testFile);
          el.files = dataTransfer.files;
          el.dispatchEvent(new Event("change", { bubbles: true }));
        });
      cy.get(".notification-container")
        .find(".message", { timeout: 100000 })
        .should(($message) => {
          expect($message.text()).to.equal(
            "ABIBULA__Etape_0_de_10_Superieur.stl downloaded",
          );
        });
    });

    cy.get("[data-test=card-body]")
      .first()
      .should(($filename) => {
        expect($filename.text()).to.equal(
          "ABIBULA__Etape_0_de_10_Superieur.stl",
        );
      });
  });

  it("cutline_validation", () => {
    cy.getPatientRow("cutline_test")
      .find("[data-test=link_patient_dashboard]")
      .first()
      .click();

    cy.get("[data-test=cutlines]").click();
    cy.get("[data-test=dropdown-sub-1]").first().click();

    cy.get("[data-test=selectSetup]").type("{enter}");

    cy.get("[data-test=model-cards-upper]")
      .find(".card")
      .last()
      .find("[data-test=card-body]")
      .click();

    /* Test the end of loading */
    cy.get("[data-testid=wrapper]")
      .find("[data-testid=overlay]", { timeout: 30000 })
      .should("not.exist");

    cy.get("[data-test=cutline_validation]").click();

    /* Test the end of loading */
    cy.get("[data-testid=wrapper]")
      .find("[data-testid=overlay]", { timeout: 30000 })
      .should("not.exist");

    cy.get("[data-test=model-cards-upper]")
      .find(".card")
      .last()
      .find("[data-test=card-head]")
      .find("[data-test=badge-ok]", { timeout: 50000 });
  });
});
