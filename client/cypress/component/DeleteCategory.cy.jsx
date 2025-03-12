//RUN AFTER ADDING TRANSACTION
import { mount } from "@cypress/react";
import ExpenseEditor from "../../src/components/ExpenseEditor";

describe('הוספת קטגוריה', () => {
    it('מחיקת קטגוריה', () => {
        cy.intercept('POST', 'http://localhost:5500/api/profile/rem_cat_items').as('delteCategory');
        mount(
            <ExpenseEditor username={"test"} profileName={'יוסי כהן'} />
        );
        cy.get('button').contains('test').click();
        cy.get('button').contains('מחק קטגוריה').click();
        cy.get('button').contains('אישור').click();
        cy.wait('@delteCategory').its('response.statusCode').should('eq', 200);
    });
});


