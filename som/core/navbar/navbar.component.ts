// angular2 imports
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { DROPDOWN_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

export interface NavData {
  name: string;
  routeName?: string;
  params?: {};
  dropdown?: {};
  dropdownMegaMenu?: {};
}

@Component({
  selector: 'lxk-navbar',
  directives: [ROUTER_DIRECTIVES, DROPDOWN_DIRECTIVES],
  template: ` 
    <div class="collapse in navbar-collapse" id="myNavbar">
      <div>
        <ul class="nav nav-pills nav-justified" (window:resize)="onResize($event)" 
          [ngClass]="{collapse: isCollapse}">
          <li *ngFor="let nav of navData; let i=index">
            <span *ngIf="nav.url" (click)="onClick(nav.name)"> 
            <!-- This is a link -->
              <a href="{{ nav.url }}">{{ nav.name }}</a>
            </span>
            <span *ngIf="nav.routeName" (click)="onClick(nav.name)"> 
            <!-- This is a menu button -->
              <a [routerLink]="[ nav.routeName ]">{{ nav.name }}</a>
            </span>
            <!-- This is a dropdown -->
            <span dropdown *ngIf="!nav.routeName && !nav.url" class="dropdown">
              <a dropdownToggle class="dropdown-toggle" data-toggle="dropdown" role="button" 
                href="#">{{ nav.name }}
                <span class="caret"></span>
              </a>
              <ul class="dropdown-menu" [ngClass]="dropdownRightClass(i, navData.length)">
                <div class="mega-menu">
                  <!-- This is a dropdown list -->
                  <div *ngIf="nav.dropdown" class="mega-menu-1-col">
                    <ul>
                      <li *ngFor="let link of nav.dropdown">
                        <a class="dropdown-item" (click)="onClick(link.name)" 
                          [routerLink]="[ link.routeName ]">{{ link.name }}
                        </a>
                      </li>
                    </ul>
                  </div>
                  <!-- This is a dropdown with submenu -->
                  <div *ngIf="nav.dropdownMegaMenu" 
                    [ngClass]="getColumnClass(nav.dropdownMegaMenu)">
                    <ul>
                      <div *ngFor="let subMenu of nav.dropdownMegaMenu" class="sub-menu">
                        <li>{{subMenu.name}}</li>
                        <ul>
                          <li *ngFor="let listItem of subMenu.subMenu">
                            <a (click)="onClick(listItem.name)" 
                              [routerLink]="[ listItem.routeName ]">{{ listItem.name }}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </ul>
                  </div>
                </div>
              </ul>
            </span>
          </li>
          <li class="hidden-sm hidden-md hidden-lg" [ngClass]="{hidden: !settings}">
            <a href="#" class="icon-gear waffle" aria-hidden="true"> Settings</a>
          </li>
          <li class="hidden-sm hidden-md hidden-lg" [ngClass]="{hidden: !apps}">
            <a href="#" class="icon-gallery waffle" aria-hidden="true"> Apps</a>
          </li>
        </ul>
      </div>
    </div>
  `
})

export class NavbarComponent {
  @Input() apps: any[];
  @Input() isCollapse;
  @Output() navClick = new EventEmitter();
  @Input() navData: NavData[];
  @Output() collapse = new EventEmitter();
  @Input() settings: any[];

  constructor(private router: Router) {

  }

  onClick(event) {
    this.navClick.emit(event);
  }

  getColumnClass(subMenu) {
    const MAX_ROWS = 26;
    let items: number = 0;
    for (let obj of subMenu) {
      items += obj.subMenu.length + 1;
    }
    return 'mega-menu-' + Math.ceil(items / MAX_ROWS) + '-col';
  }

  dropdownRightClass(i, length) {
    if (i > (length / 2)) {
      return 'dropdown-menu-right';
    }
    return;
  }

  onResize(event) {
    if (event.target.innerWidth > 786) {
      this.collapse.emit(false);
    } else {
      this.collapse.emit(true);
    }
  }
}
