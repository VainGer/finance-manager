import { mount } from '@cypress/react';
import LoginPopup from "../../src/components/LoginPopup";
import { MemoryRouter } from "react-router-dom";
describe('כניסה למשתמש', () => {
    it('הקלדה של שם משתמש וסיסמה, צריך לעבור לעמוד בחירת פרופיל', () => {
        mount(
            <MemoryRouter>
                <LoginPopup />
            </MemoryRouter>
        );
        cy.get('[data-testid="login"]').type('test');
        cy.get('[data-testid="password"]').type('1234');
        cy.get('[data-testid="submit"]').click();
        cy.location('pathname').should('eq', '/account');
    });
});