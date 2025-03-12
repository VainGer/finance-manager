//RUN AFTER ADDITEM
import { mount } from '@cypress/react';
import AddTransactInReport from '../../src/components/AddTransactInReport';


describe('הוספה ומחיקה של הוצאה', () => {
    it('הוספה של הוצאה', () => {
        cy.intercept('POST', 'http://localhost:5500/api/profile/add_transact').as('addTransact');
        mount(
            <AddTransactInReport username={"test"} profileName={'יוסי כהן'} category={'test'} item={'testItem'} />
        );
        cy.get('[data-testid="price"]').type('100');
        cy.get('[data-testid="submit"]').click();
        cy.wait('@addTransact').its('response.statusCode').should('eq', 200);
    });
});
