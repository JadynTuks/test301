import React from 'react'
import App from './App'

describe('App Navigation', () => {
  beforeEach(()=>{
    cy.mount(<App />)
  })

  it('renders navigation', () => {
    // see: https://on.cypress.io/mounting-react
    cy.get(".navbar").should("be.visible")
  })
  
  // it('renders Dashboard page', () => {
  //   // see: https://on.cypress.io/mounting-react
  //   cy.contains("Dash").click()
  //   cy.url().should("include", "/dashboard");
  // })
  
  // it('renders Data page', () => {
  //   // see: https://on.cypress.io/mounting-react
  //   cy.contains("Data").click();
  //   cy.url().should("include", "/data");
  // })
  
  it('renders Query page', () => {
    // see: https://on.cypress.io/mounting-react
    // Click the "Query" button and check URL
    cy.contains("Query").click();
    cy.url().should("include", "/query");
  })
  
  // it('renders Users page', () => {
  //   // see: https://on.cypress.io/mounting-react
  //   // Click the "Query" button and check URL
  //   // Click the "Users" button and check URL
  //   cy.contains("Users").click();
  //   cy.url().should("include", "/users");

  // })
  

  
})

describe('Query Processing', () => {
  beforeEach(()=>{
    cy.mount(<App />)
    cy.contains("Query").click();

  })


  it("should display the query dropdown", () => {
    cy.get("#query-dropdown").should("be.visible");
  });

  it("should show create options when 'Create' is selected", () => {
    cy.get("#query-dropdown").select("create");
    cy.get("#create-options-dropdown").should("be.visible");
  });

  it("should allow creating a new database", () => {
    cy.get("#query-dropdown").select("create");
    cy.get("#create-options-dropdown").select("database");
    cy.get("#create-value").type("TestDatabase");
    cy.get("#save-button").click();
    cy.on("window:alert", (txt) => {
      expect(txt).to.contain("TestDatabase created successfully");
    });
  });

  // it("should allow selecting a database when inserting data", () => {
  //   cy.get("#query-dropdown").select("insert");
  //   cy.get("#database-dropdown").should("be.visible");
  //   cy.get("#database-dropdown").select("testdb");
  //   cy.get("#colletion-dropdown").should("be.visible");
  // });

  // it("should enable the JSON input field when inserting data", () => {
  //   cy.get("#query-dropdown").select("insert");
  //   cy.get("#database-dropdown").select("testdb");
  //   cy.get("#colletion-dropdown").select("testCollection");
  //   cy.get("#json-input").should("be.visible").type('{"name": "Test Item"}');
  //   cy.get("#save-button").should("be.enabled").click();
  //   cy.on("window:alert", (txt) => {
  //     expect(txt).to.contain("Added Successfully!");
  //   });
  // });

  // it("should allow deleting a collection", () => {
  //   cy.get("#query-dropdown").select("delete");
  //   cy.get("#database-dropdown").select("testdb");
  //   cy.get("#colletion-dropdown").select("testCollection");
  //   cy.get("#save-button").click();
  //   cy.on("window:alert", (txt) => {
  //     expect(txt).to.contain("testCollection deleted successfully");
  //   });
  // });

  // it("should allow adding filters", () => {
  //   cy.get("#query-dropdown").select("delete");
  //   cy.get("#database-dropdown").select("testdb");
  //   cy.get("#colletion-dropdown").select("testCollection");
  //   cy.get("#add-filter-button").click();
  //   cy.get("#filters-section").children().should("have.length.greaterThan", 0);
  // });

  // it("should allow updating documents", () => {
  //   cy.get("#query-dropdown").select("update");
  //   cy.get("#database-dropdown").select("testdb");
  //   cy.get("#colletion-dropdown").select("testCollection");
  //   cy.get("#add-filter-button").click();
  //   cy.get("#filters-section").children().should("have.length.greaterThan", 0);
  //   cy.get("#save-button").click();
  //   cy.on("window:alert", (txt) => {
  //     expect(txt).to.contain("Update successful");
  //   });
  // });
})