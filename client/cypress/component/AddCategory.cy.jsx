import { mount } from '@cypress/react';
import AddCategory from '../../src/components/AddCategory';

describe('הוספת קטגוריה', () => {
    it('הוספת קטגוריה חדשה', () => {
        mount(
            <AddCategory username={"test"} profileName={'יוסי כהן'} />
        );
        cy.get('[data-testid="category"]').type('test');
        cy.get('[data-testid="submit"]').click();
        cy.get('[data-testid="success"]').should('exist');
    });
    it('נסיון הוספת קטגוריה קיימת והודעה על שגיאה', () => {
        mount(
            <AddCategory username={"test"} profileName={'יוסי כהן'} />
        );
        cy.get('[data-testid="category"]').type('test');
        cy.get('[data-testid="submit"]').click();
        cy.get('[data-testid="error"]').should('exist');
    });
});
