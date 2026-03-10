import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { AddTransactionComponent } from '../../actions/add-transaction/add-transaction.component';
import { MenuBtnComponent } from '../menu-btn/menu-btn.component';
import { CreateCategoryComponent } from '../../actions/categories/create-category/create-category.component';
import { DeleteCategoryComponent } from '../../actions/categories/delete-category/delete-category.component';
import { RenameCategoryComponent } from '../../actions/categories/rename-category/rename-category.component';
import { AddBusinessComponent } from '../../actions/business/add-business/add-business.component';
import { DeleteBusinessComponent } from '../../actions/business/delete-business/delete-business.component';
import { RenameBusinessComponent } from '../../actions/business/rename-business/rename-business.component';
import { CreateBudgetComponent } from '../../actions/budgets/create-budget/create-budget.component';
import { DeleteBudgetComponent } from '../../actions/budgets/delete-budget/delete-budget.component';
type MenuAction = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
};

type Menu = {
  title: string;
  subtitle: string;
  icon: string;
  actions: MenuAction[];
  note?: string;
};

@Component({
  selector: 'app-actions-menu',
  imports: [
    AddTransactionComponent,
    CreateCategoryComponent,
    DeleteCategoryComponent,
    RenameCategoryComponent,
    AddBusinessComponent,
    DeleteBusinessComponent,
    RenameBusinessComponent,
    CreateBudgetComponent,
    DeleteBudgetComponent,
    MenuBtnComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './actions-menu.component.html',
  styleUrl: './actions-menu.component.css',
})
export class ActionsMenuComponent {
  @Input() chosenMenu: string = '';
  @Input() isOpen = false;
  chosenAction: string = '';

  menus: Record<string, Menu> = {
    //Budget
    budgets: {
      title: 'ניהול תקציבים',
      subtitle: 'ייצור ומחיקת תקציבים',
      icon: '',
      actions: [
        {
          id: 'create',
          icon: '',
          title: 'יצירת תקציב חדש',
          subtitle: 'הגדר תקציב חדש לתקופה מסוימת',
        },
        {
          id: 'delete',
          icon: '',
          title: 'מחיקת תקציב',
          subtitle: 'מחק תקציב קיים(ללא מחיקת הנתונים בתקופת התקציב)',
        },
      ],
      note: 'מחיקת תקציב תמחק רק את מסגרת התקציב ולא את הנתונים והעסקאות שלך. כל ההוצאות שרשמת יישארו שמורות.',
    },
    //Category
    categories: {
      title: 'ניהול קטגוריות',
      subtitle: 'ארגן הוצאות לפי קטגוריות',
      icon: '',
      actions: [
        {
          id: 'create',
          icon: '',
          title: 'הוספת קטגוריה',
          subtitle: 'הוסף קטגוריה חדשה למערכת',
        },
        {
          id: 'rename',
          icon: '',
          title: 'שינוי שם קטגוריה',
          subtitle: 'ערוך שם של קטגוריה קיימת',
        },
        {
          id: 'delete',
          icon: '',
          title: 'מחיקת קטגוריה',
          subtitle: 'הסר קטגוריה מהמערכת',
        },
      ],
    },
    //Business
    business: {
      title: 'ניהול בעלי עסקים',
      subtitle: 'נהל עסקים',
      icon: '',
      actions: [
        {
          id: 'create',
          icon: '',
          title: 'הוספת בעל עסק',
          subtitle: 'הוסף בעל עסק חדש למערכת',
        },
        {
          id: 'rename',
          icon: '',
          title: 'שינוי שם בעל עסק',
          subtitle: 'ערוך שם של בעל עסק קיים',
        },
        {
          id: 'delete',
          icon: '',
          title: 'מחיקת בעל עסק',
          subtitle: 'הסר בעל עסק מהמערכת',
        },
      ],
    },
    //Transaction
    transaction: {
      title: 'הוספת עסקה חדשה',
      subtitle: 'הוסף הוצאה לפרופיל',
      icon: '',
      actions: [],
    },
  };

  get menuToDisplay(): Menu | null {
    if (this.chosenMenu) {
      this.chosenMenu === 'transaction' ? (this.chosenAction = 'create') : '';
      return this.menus[this.chosenMenu];
    }
    return null;
  }

  get actionKey(): string {
    return `${this.chosenMenu}-${this.chosenAction}`;
  }

  setAction(action: string) {
    this.chosenAction = action;
  }
}
