import {
  Component,
  Input,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';

@Component({
  selector: 'app-menu-btn',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './menu-btn.component.html',
  styleUrl: './menu-btn.component.css',
})
export class MenuBtnComponent {
  @Input() icon = '';
  @Input() title = '';
  @Input() subtitle = '';
  @Output() onClick = new EventEmitter();
}
