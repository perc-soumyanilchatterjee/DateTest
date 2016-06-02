import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import { NavbarComponent } from '../navbar/navbar.component';
import { HeaderData } from './header.model';

@Component({
  selector: 'lxk-header',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, DROPDOWN_DIRECTIVES],
  template: `
    <nav class="navbar navbar-default">
      <div class="navbar-header">
        <div>
          <header class="row page-header">
            <span class="col-lg-7 col-md-7 col-sm-8 col-xs-9 text-left">
              <button type="button" class="navbar-toggle" data-toggle="collapse" 
                data-target="#myNavbar" (click)="onCollapse(!isCollapse)">
                <span class="icon-contextual_menu"></span>
              </button>
              <span class="hidden-xs">
                <a href="http://www.lexmark.com">
                  <img src="assets/images/LexmarkLogo_RGB_Reversed.svg" class="nav_logo" 
                    aria-hidden="true">
                </a>
              </span>
              {{ headerData.appName }}
            </span>
            <div class="col-lg-5 col-md-5 col-sm-4 col-xs-3 text-right">
              <span class="hidden-xs">
                <span class="icon-gear nav_settings" aria-hidden="true" 
                  [ngClass]="{hidden: !headerData.settings, nav_settings_border: headerData.apps}"
                  (click)="onSettingsClicked($event)">
                </span>
                <span class="icon-gallery nav_waffle" aria-hidden="true" 
                  [ngClass]="{hidden: !headerData.apps}">
                </span>
              </span>
              <span *ngIf="headerData.userOptions" dropdown class="dropdown navbar-dropdown">
                <a href dropdownToggle class="dropdown-toggle" data-toggle="dropdown" role="button"
                  aria-haspopup="true" aria-expanded="false" >
                  <span class="icon-user nav_user">
                    <span class="hidden-xs nav_user_text"> {{getUserName()}} </span>
                  </span>
                  <span class="caret hidden-xs"></span>
                </a>
                <ul class="dropdown-menu pull-right">
                  <li *ngFor="let userOption of headerData.userOptions.options">
                    <a class="dropdown-item" (click)="onUserClicked(userOption.id)" 
                    href="#">{{userOption.name}}
                    </a>
                  </li>
                </ul>
              </span>
            </div>
          </header>
        </div>
        <lxk-navbar [navData]="headerData.navData" [settings]="headerData.settings" 
          [apps]="headerData.apps" [isCollapse]="isCollapse" (collapse)="onCollapse($event)" 
          (navClick)="onNavClicked($event)">
        </lxk-navbar>
      </div>
    </nav>
  `
})

export class HeaderComponent {
  @Input() public headerData: HeaderData;
  @Output() navClick = new EventEmitter();
  @Output() userClick = new EventEmitter();
  @Output() settingsClick = new EventEmitter();

  isCollapse: boolean;

  onNavClicked(event): void {
    this.navClick.emit(event);
  }

  onCollapse(event) {
    this.isCollapse = event;
  }

  onUserClicked(event): void {
    this.userClick.emit(event);
  }

  onSettingsClicked(event): void {
    this.settingsClick.emit(event);
  }

  getUserName() {
    if (this.headerData && this.headerData.userOptions && this.headerData.userOptions.userName) {
      return this.headerData.userOptions.userName;
    }

    return 'User';
  }
}
