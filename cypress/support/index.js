/// <reference types="Cypress" />

before(function () {});
let fs = require('fs');
const path = require('path');

// Hide fetch/XHR requests
const app = window.top;

if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

Cypress.Commands.add('readDir', (folderName) => {
  return fs.readFileSync(path.resolve(__dirname, folderName));
});

if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML = '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

Cypress.Commands.add(
  'upload',
  {
    prevSubject: 'element'
  },
  (subject, file, fileName, fileType) => {
    // we need access window to create a file below
    cy.window().then((window) => {
      // line below could maybe be refactored to make use of Cypress.Blob.base64StringToBlob, instead of this custom function.
      // inspired by @andygock, please refer to https://github.com/cypress-io/cypress/issues/170#issuecomment-389837191
      const blob = b64toBlob(file, '', 512);
      // Please note that we need to create a file using window.File,
      // cypress overwrites File and this is not compatible with our change handlers in React Code
      const testFile = new window.File([blob], fileName, {
        type: fileType
      });
      cy.wrap(subject).trigger('drop', {
        dataTransfer: { files: [testFile], types: ['Files'] }
      });
    });
  }
);

// Upload to react-dropzone
Cypress.Commands.add(
  'upload',
  {
    prevSubject: 'element'
  },
  (subject, file, fileName, fileType) => {
    // we need access window to create a file below
    cy.window().then((window) => {
      // line below could maybe be refactored to make use of Cypress.Blob.base64StringToBlob, instead of this custom function.
      // inspired by @andygock, please refer to https://github.com/cypress-io/cypress/issues/170#issuecomment-389837191
      const blob = b64toBlob(file, '', 512);
      // Please note that we need to create a file using window.File,
      // cypress overwrites File and this is not compatible with our change handlers in React Code
      const testFile = new window.File([blob], fileName, {
        type: fileType
      });
      cy.wrap(subject).trigger('drop', {
        dataTransfer: { files: [testFile], types: ['Files'] }
      });
    });
  }
);

// Code stolen from @nrutman here: https://github.com/cypress-io/cypress/issues/170
function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
}

Cypress.Commands.add('getByTestId', (testId) => {
  cy.get(`[data-qa='${testId}']`, { timeout: 20000 });
});

Cypress.Commands.add(
  'reactComponent',
  {
    prevSubject: 'element'
  },
  ($el) => {
    if ($el.length !== 1) {
      throw new Error(`cy.component() requires element of length 1 but got ${$el.length}`);
    }
    // Query for key starting with __reactInternalInstance$ for React v16.x
    const key = Object.keys($el.get(0)).find((key) => key.startsWith('__reactFiber$'));
    const domFiber = $el.prop(key);
    Cypress.log({
      name: 'component',
      consoleProps() {
        return {
          component: domFiber
        };
      }
    });
    return domFiber.return;
  }
);
