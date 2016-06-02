// angular2 imports
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

@Component({
  selector: 'lxk-footer',
  directives: [ROUTER_DIRECTIVES],
  template: `
    <div id="footer">
      <footer class="row page-footer">
        <div class="col-sm-3 col-xs-12 text-sm-left text-xs-left footer-content-padding">
          <a [routerLink]="[helpRouteName]" (click)="onClick()" 
            [ngClass]="{hidden: !helpRouteName}">
              Help
          </a>
        </div>
  
        <div class="col-sm-6 col-xs-12 text-sm-center text-xs-left horzontal-separator-footer 
          footer-content-padding" [ngClass]="getOffset()">
            &#169; 2016 Lexmark. All rights reserved.
        </div>
  
        <div class="col-sm-3 col-xs-12 text-sm-right text-xs-left logo-footer 
          footer-content-padding">
          <a href="http://www.lexmark.com">
              <img src="assets/images/LexmarkLogo_RGB_Reversed.svg" class="logo-footer" aria-hidden="true">
          </a>
        </div>
      </footer>
    </div>
  `
})

export class FooterComponent {
  @Input() helpRouteName: string;
  @Output() helpClick = new EventEmitter();

  onClick(event): void {
    this.helpClick.emit(this.helpRouteName);
  }

  getOffset(): string {
    if (!this.helpRouteName) {
      return 'col-sm-offset-3';
    }
  }
}
