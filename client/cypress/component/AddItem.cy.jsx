//RUN AFTER ADDCATEGORY
import { mount } from '@cypress/react';
import AddItem from '../../src/components/AddItem';

describe('הוספת פריט לקטגוריה', () => {
    it('הוספת קטגוריה חדשה', () => {
        cy.intercept('POST', 'http://localhost:5500/api/profile/add_item').as('addItem');
        mount(
            <AddItem username={"test"} profileName={'יוסי כהן'} category={'test'} />
        );
        cy.get('[data-testid="itemname"]').type('testItem');
        cy.get('[data-testid="submit"]').click();
        cy.wait('@addItem').its('response.statusCode').should('eq', 200);
    });
    it('נסיון הוספת פריט קיים והודעה על שגיאה', () => {
        cy.intercept('POST', 'http://localhost:5500/api/profile/add_item').as('addItem');
        mount(
            <AddItem username={"test"} profileName={'יוסי כהן'} category={'test'} />
        );
        cy.get('[data-testid="itemname"]').type('testItem');
        cy.get('[data-testid="submit"]').click();
        cy.wait('@addItem').its('response.statusCode').should('eq', 400);
    });
});
