/// <reference types="cypress" />

describe('Angular Doc Search', () => {
  it('shows native results', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        // ServiceWorker messes up with the page load
        delete win.navigator.__proto__.serviceWorker
      }
    })
    // delay each keystroke for the demo
    cy.get('input[aria-label=search]').type('testing', {delay: 70})

    // six search results columns
    cy.get('.search-section-header').should('have.length', 6)
    cy.contains('.search-section-header', 'cli')
      .parent('.search-area')
      .find('.search-page').should('have.length.gte', 3)
  })

  it('shows single search result', () => {
    // https://on.cypress.io/intercept
    cy.intercept('/search-data.json', { fixture: 'single-result.json' })
    cy.visit('/', {
      onBeforeLoad(win) {
        // ServiceWorker messes up with the page load
        delete win.navigator.__proto__.serviceWorker
      }
    })
    // delay each keystroke for the demo
    cy.get('input[aria-label=search]').type('testing', { delay: 70 })

    cy.contains('.search-section-header', 'cli')
      .parent('.search-area')
      .contains('.search-page', 'Testing is fun').click()

    cy.location('pathname').should('equal', '/cli/test')
  })
})
