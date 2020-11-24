/// <reference types="cypress" />
import singleResult from '../fixtures/single-result.json'

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
      .contains('.search-page', 'Testing is fun')
      .click()

    cy.location('pathname')
      .should('equal', '/cli/test')
  })

  it('shows single search result (better)', () => {
    // https://on.cypress.io/intercept
    cy.intercept('/search-data.json', singleResult)
    cy.visit('/', {
      onBeforeLoad(win) {
        // ServiceWorker messes up with the page load
        delete win.navigator.__proto__.serviceWorker
      }
    })
    const {headingWords, title, path} = singleResult[0]
    // delay each keystroke for the demo
    cy.get('input[aria-label=search]')
      .type(headingWords, { delay: 70 })

    cy.get('.search-section-header')
      .parent('.search-area')
      .contains('.search-page', title)
      .click()

    cy.location('pathname')
      .should('equal', '/' + path)
  })

  it('checks one of the search results', () => {
    // spy on the network request, but do not mock it
    cy.intercept('/search-data.json').as('search')
    cy.visit('/', {
      onBeforeLoad(win) {
        // ServiceWorker messes up with the page load
        delete win.navigator.__proto__.serviceWorker
      }
    })
    cy.wait('@search').its('response.body')
      .then(list => {
        return Cypress._.find(list, { title: 'Accessibility in Angular' })
      })
      .then(result => {
        expect(result).to.be.an('object')
        const { headingWords, title, path } = result
        const search = headingWords.split(' ')[0]
        // delay each keystroke for the demo
        cy.get('input[aria-label=search]')
          .type(search, { delay: 70 })

        cy.contains('.search-page a', title).click()
        cy.location('pathname')
          .should('equal', '/' + path)
      })
  })
})
