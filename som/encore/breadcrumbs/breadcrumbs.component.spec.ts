import {
    it,
    describe,
    expect,
    beforeEach,
    beforeEachProviders,
    async,
    inject
} from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';
import {
    Router,
    ROUTER_PROVIDERS,
    ROUTER_PRIMARY_COMPONENT,
    RouteRegistry,
    RouteConfig
} from '@angular/router-deprecated';
import { LocationStrategy } from '@angular/common';
import { provide } from '@angular/core';
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import { MockLocationStrategy, SpyLocation } from '@angular/common/testing';

import { BreadcrumbsComponent } from './breadcrumbs.component';

@RouteConfig([
  {path: '/test1', name: 'Test1', component: BreadcrumbsComponent},
  {path: '/test2', name: 'Test2', component: BreadcrumbsComponent},
  {path: '/test3', name: 'Test3', component: BreadcrumbsComponent}
])

class MyBreadcrumbs extends BreadcrumbsComponent {
}

class MockRouter  {
  navigate(params) {
    // intentionally empty
  };
}

export function main() {
  'use strict';
  describe('Breadcrumbs', () => {
    let breadcrumbs: BreadcrumbsComponent;
    let mockRouter = new MockRouter();
    let test1 = {name: 'Test1', routeName: 'Test1'};
    let test2 = {name: 'Test2', routeName: 'Test2', params: {id: 2}};
    beforeEach(() => {
      breadcrumbs = new BreadcrumbsComponent(mockRouter as Router);
      breadcrumbs.breadcrumbs = [test1, test2];
    });

    beforeEachProviders(() => [
      ROUTER_FAKE_PROVIDERS,
      ROUTER_PROVIDERS,
      RouteRegistry,
      provide(Router, {useValue: mockRouter}),
      provide(Location, {useClass: SpyLocation}),
      provide(LocationStrategy, {useClass: MockLocationStrategy}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: MyBreadcrumbs})
    ]);

    it('should test emit breadcrumbClick', () => {
      let event = {target: {id: 0}};
      breadcrumbs.breadcrumbClick.emit = function (name) {
        expect(name).toBe(test1);
      };
      mockRouter.navigate = function (params) {
        expect(params[0]).toBe('Test1');
      };
      breadcrumbs.onClick(event);
    });

    it('should test emit breadcrumbClick with params', () => {
      let event = {target: {id: 1}};
      breadcrumbs.breadcrumbClick.emit = function (name) {
        expect(name).toBe(test2);
      };
      mockRouter.navigate = function (params) {
        expect(params[0]).toBe('Test2');
        expect(params[1]).toBeDefined();
        expect(params[1].id).toBe(2);
      };
      breadcrumbs.onClick(event);
    });

    it('should test 2 breadcrumbs created',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         tcb.createAsync(BreadcrumbsComponent).then((fixture) => {
           let component = fixture.componentInstance;
           component.breadcrumbs = [test1, test2];

           fixture.detectChanges();
           let element = fixture.nativeElement;
           expect(element.querySelectorAll('li').length).toBe(2);
         });
    })));
  });
}
