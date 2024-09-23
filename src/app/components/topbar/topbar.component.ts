import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  //@Input() openSidebar!:boolean;
  @Output() alterSidebar = new EventEmitter();

  alter(){
    this.alterSidebar.emit();
  }
}
