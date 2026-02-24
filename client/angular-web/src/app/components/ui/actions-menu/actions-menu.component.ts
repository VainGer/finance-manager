import { Component, Input } from '@angular/core';

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
  imports: [],
  templateUrl: './actions-menu.component.html',
  styleUrl: './actions-menu.component.css',
})
export class ActionsMenuComponent {
  @Input() chosenMenu: string = '';
  @Input() isOpen = false;
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
  };
}
