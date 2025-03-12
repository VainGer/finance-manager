import { mount } from '@cypress/react';
import { MemoryRouter } from 'react-router-dom';
import Account from '../../src/pages/Account';

describe('כניסה לפרופיל', () => {
    it('הקלדה של שם קוד סודי נכון', () => {
        cy.intercept('POST', 'http://localhost:5500/api/user/enter').as('profileEnter');
        mount(
            <MemoryRouter initialEntries={[
                {
                    pathname: '/account',
                    state: {
                        username: 'test'
                    }
                }
            ]}>
                <Account />
            </MemoryRouter>
        );
        cy.contains('button', 'יוסי כהן').click();
        cy.get('[data-testid="pin"]').type('1234');
        cy.get('[data-testid="submit"]').click();
        cy.wait('@profileEnter').its('response.statusCode').should('eq', 200);
    });
    it('הקלדה של שם קוד סודי שגוי', () => {
        cy.intercept('POST', 'http://localhost:5500/api/user/enter').as('profileEnter');
        mount(
            <MemoryRouter initialEntries={[
                {
                    pathname: '/account',
                    state: {
                        username: 'test'
                    }
                }
            ]}>
                <Account />
            </MemoryRouter>
        );
        cy.contains('button', 'יוסי כהן').click();
        cy.get('[data-testid="pin"]').type('1111');
        cy.get('[data-testid="submit"]').click();
        cy.wait('@profileEnter').its('response.statusCode').should('eq', 401);
    });
});
