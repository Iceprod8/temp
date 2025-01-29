// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add("resetdb", () => {
  cy.request({
    method: "POST",
    url: "http://localhost:8000/token-auth/",
    body: {
      username: "admin",
      password: "admin",
    },
    form: true,
  }).then((resp) => {
    const { token } = resp.body;

    cy.request({
      method: "POST",
      url: "http://localhost:8000/tests/commands",
      timeout: 90000,
      body: {
        cmd: "resetdb",
      },
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
  });
});

Cypress.Commands.add("login", (username, password) => {
  cy.request({
    method: "POST",
    url: "http://localhost:8000/token-auth/",
    body: {
      username: username || "brice",
      password: password || "forunittest",
    },
    form: true,
  }).then((resp) => {
    const { token } = resp.body;
    window.localStorage.setItem("token", token);
    cy.visit("/patients");
    cy.get(".page-tab");
  });
});

Cypress.Commands.add("logout", () => {
  window.localStorage.removeItem("token");
  cy.visit("/");
});

Cypress.Commands.add("ignoreUncaught", (msg) => {
  cy.get("@uncaughtManager").then((manager) => {
    manager.ignore(msg);
  });
});

Cypress.Commands.add("getPatientRow", (name) =>
  cy.get(`td[value=${name}]`).parent()
);
