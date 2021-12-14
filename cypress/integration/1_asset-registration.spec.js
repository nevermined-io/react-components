/// <reference types="Cypress" />

describe.skip('Asset Registration', () => {
  before(() => {
    cy.visit('/');
    // Wait for end of loading
    // cy.get('button', { timeout: 60000 }).should('have.length', 1);
  });

  it("should do something", () => {
    cy.get("button.")
  })
});
