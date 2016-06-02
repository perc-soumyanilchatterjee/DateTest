// angular2 imports
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router-deprecated';

import { Breadcrumb } from './breadcrumb.model';

@Component({
  selector: 'lxk-breadcrumbs',
  template: `
    <ul class="breadcrumb" >
      <li *ngFor="let crumb of breadcrumbs; let i=index">
        <a id="{{i}}" *ngIf="i < breadcrumbs.length - 1"  (click)="onClick($event)" 
          role="button">{{crumb.name}}
        </a>
        <span *ngIf="i == breadcrumbs.length - 1" class="active">{{crumb.name}}</span>
        <span [ngClass]="{hidden: i == breadcrumbs.length - 1}" 
          class="glyphicon icon-caret_right_thin breadcrumb-caret" aria-hidden="true"></span>
      </li>
    </ul>
  `
})

export class BreadcrumbsComponent {
  @Input() breadcrumbs: Breadcrumb[];
  @Output() breadcrumbClick = new EventEmitter();

  constructor(private router: Router) {};

  onClick(event): void {
    let index = +event.target.id + 1;
    this.breadcrumbs.splice(index, this.breadcrumbs.length - index);
    this.router.navigate([this.breadcrumbs[event.target.id].routeName,
      this.breadcrumbs[event.target.id].params]);
    this.breadcrumbClick.emit(this.breadcrumbs[event.target.id]);
  }
}
