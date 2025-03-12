import { mount } from '@cypress/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../../src/pages/Home';

describe('כניסה למשתמש', () => {
    it('הקלדה של שם משתמש וסיסמה נכונים', () => {
        mount(
            <MemoryRouter initialEntries={['/']}>
                <Home />
            </MemoryRouter>
        );
        cy.get('[data-testid="loginBtn"]').click();
        cy.get('[data-testid="login"]').type('correctUser');
        cy.get('[data-testid="password"]').type('correctPassword');
        cy.get('[data-testid="submit"]').click();
        cy.get('[data-testid="welcome"]').should('exist');
    });
    it('נסיון כניסה עם שם משתמש וסיסמה ריקים', () => {
        mount(
            <MemoryRouter initialEntries={['/']}>
                <Home />
            </MemoryRouter>
        );
        cy.get('[data-testid="loginBtn"]').click();
        cy.get('[data-testid="submit"]').click();
        cy.get('[data-testid="error"]').should('have.text', 'שם משתמש וסיסמה אינם יכולים להיות ריקים.');
    });
    it('נסיון כניסה עם שם משתמש ו/או סיסמה שגויים', () => {
        mount(
            <MemoryRouter initialEntries={['/']}>
                <Home />
            </MemoryRouter>
        );
        cy.get('[data-testid="loginBtn"]').click();
        cy.get('[data-testid="login"]').type('incorrectUser');
        cy.get('[data-testid="password"]').type('incorrectPassword');
        cy.get('[data-testid="submit"]').click();
        cy.get('[data-testid="error"]').should('have.text', 'שם משתמש או סיסמה שגויים.');
    });
});
