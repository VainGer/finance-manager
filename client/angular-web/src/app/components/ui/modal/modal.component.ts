import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter();

  close() {
    this.closeModal.emit();
  }
}
