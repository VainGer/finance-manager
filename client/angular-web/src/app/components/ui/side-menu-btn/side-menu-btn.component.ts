import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-side-menu-btn',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './side-menu-btn.component.html',
  styleUrl: './side-menu-btn.component.css',
})
export class SideMenuBtnComponent {
  @Input() icon = '';
  @Input() title = '';
  @Input() subtitle = '';
  @Output() onClick = new EventEmitter();
}
