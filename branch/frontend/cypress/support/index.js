// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "cypress-real-events/support";

import "./commands";

class UncaughtManager {
  constructor() {
    this.ignoreErrorMsgs = [];
    this.uncaught = [];
  }

  ignore(msg) {
    this.ignoreErrorMsgs.push(msg);
  }

  exception(msg) {
    const match = msg.match(new RegExp(this.ignoreErrorMsgs.join("|")));
    this.uncaught.push(match);
  }

  is_fail() {
    const val = this.uncaught.every((x) => x);
    expect(val).to.be.true;
  }

  clean() {
    this.ignoreErrorMsgs = [];
    this.uncaught = [];
  }
}

class RequestCounter {
  constructor() {
    this.count = 0;
  }

  inc() {
    this.count += 1;
  }

  dec() {
    this.count -= 1;
    return this.count;
  }

  notempty() {
    return this.count > 0;
  }

  clean() {
    this.count = 0;
  }
}

const uncaughtManager = new UncaughtManager();
const requestCounter = new RequestCounter();

Cypress.on("uncaught:exception", (err) => {
  uncaughtManager.exception(err.message);
  return false;
});

beforeEach(() => {
  uncaughtManager.clean();
  requestCounter.clean();

  cy.wrap(uncaughtManager).as("uncaughtManager");

  cy.window().then((win) => {
    cy.spy(win.console, "error").as("console_error");
    cy.spy(win.console, "warn").as("console_warn");
  });

  cy.intercept("http://localhost:8000/api/1/**/*", (x) => {
    requestCounter.inc(x.url);
  }).as("requesters");
});

function waitRequests() {
  if (requestCounter.notempty()) {
    cy.wait("@requesters").then(() => {
      requestCounter.dec();
      waitRequests();
    });
  }
}

afterEach(() => {
  if (cy.state("test").state === "failed") {
    Cypress.runner.stop();
  }

  cy.wait(5000);

  cy.ignoreUncaught("Network Error");

  cy.intercept("http://localhost:8000/api/1/**/*", {
    forceNetworkError: true,
  });

  /* Wait all requests */
  waitRequests();

  cy.get("@console_error").should(($c) => {
    if ($c && $c.callCount > 0) {
      expect($c).to.always.be.calledWithMatch("Warning");
    }
  });

  uncaughtManager.is_fail();
});
