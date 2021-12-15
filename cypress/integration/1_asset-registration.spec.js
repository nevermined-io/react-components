/// <reference types="Cypress" />

const $ = (id, elem) => cy.get(`*[data-qa="${id}"]` + (elem ? ` *[data-qa-elem="${elem}"]` : ''));
const $name = (id) => cy.get(`input[name="${id}"], textarea[name="${id}"]`);

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
    cy.visit('/');
    cy.get('.asset-registration', { timeout: 60000 }).should('contain', 'Details');
    // cy.get('article form h2', { timeout: 60000 }).should('contain', 'Details');
  });
});
