import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent {
  @Input() title!: string;
  @Output() close = new EventEmitter<void>();

  constructor() { }

  onClose() {
    this.close.emit();
  }
}