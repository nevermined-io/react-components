/// <reference types="Cypress" />

const $ = (id, elem, options) =>
  cy.get(`*[data-qa="${id}"]` + (elem ? ` *[data-qa-elem="${elem}"]` : ''), options);
const $name = (id) => cy.get(`input[name="${id}"], textarea[name="${id}"]`);
window.addEventListener('unhandledrejection', (event) => {
  throw event.reason;
});

const mnemonic =
  process.env.REACT_APP_BURNER_MNEMONIC ||
  'taxi music thumb unique chat sand crew more leg another off lamp';

describe('Asset Registration', () => {
  before(() => {
    localStorage.setItem('seedphrase', mnemonic);
  });
  beforeEach(() => {
    // cy.get('.asset-registration');
  });

  it('should do something', () => {
    cy.visit('/', {});
    cy.wait(5000);
    cy.get('.asset-registration', { timeout: 60000 }).should('contain', 'Details');
    $('next-button', null, {}).should('not.be.disabled');
    $('next-button', null, {}).click();
    $('next-button', null, {}).click();
    cy.wait(5000);
    $('submit-button').click();
    cy.wait(5000);
    cy.get('#successMessage');
    // cy.get('article form h2', { timeout: 60000 }).should('contain', 'Details');
  });
});
