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
    ROUTER_PRIMARY_COMPONENT,
    RouteRegistry,
    RouteConfig
} from '@angular/router-deprecated';
import { LocationStrategy } from '@angular/common';
import { provide } from '@angular/core';
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import { MockLocationStrategy, SpyLocation } from '@angular/common/testing';
import { RootRouter } from '@angular/router-deprecated/src/router';

import { NavbarComponent } from './navbar.component';

@RouteConfig([
  {path: '/test', name: 'Test', component: NavbarComponent}
])

class MyNavbar extends NavbarComponent {

}

export function main() {
  'use strict';
  describe('Navbar', () => {
    let navBar: NavbarComponent;

    beforeEach(() => {
      navBar = new MyNavbar(Router);
    });

    beforeEachProviders(() => [
      ROUTER_FAKE_PROVIDERS,
      RouteRegistry,
      provide(Router, { useClass: RootRouter }),
      provide(Location, {useClass: SpyLocation}),
      provide(LocationStrategy, {useClass: MockLocationStrategy}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: MyNavbar})
    ]);

    it('should test emit navClick', () => {
      let event: String = 'test';
      navBar.navClick.emit = function (name) {
        expect(name).toBe(event);
      };
      navBar.onClick(event);
    });

    it('should test emit collapse', () => {
      let event = {target: {innerWidth: 100}};
      navBar.collapse.emit = function (value) {
        expect(value).toBeDefined(true);
      };
      navBar.onResize(event);

      event = {target: {innerWidth: 1000}};
      navBar.collapse.emit = function (value) {
        expect(value).toBeDefined(false);
      };
      navBar.onResize(event);
    });

    it('should test dropdownRightClass()', () => {
      expect(navBar.dropdownRightClass(1, 2)).not.toBe('dropdown-menu-right');
      expect(navBar.dropdownRightClass(2, 2)).toBe('dropdown-menu-right');
    });

    it('should test waffle shows',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(NavbarComponent).then((fixture) => {
          let component = fixture.componentInstance;
          let element = fixture.nativeElement;
          fixture.detectChanges();

          expect(element.querySelector('.icon-gallery').parentElement).toHaveCssClass('hidden');

          component.apps = true;
          fixture.detectChanges();
          expect(element.querySelector('.icon-gallery').parentElement).not.toHaveCssClass('hidden');
        });
    })));

    it('should test settings show',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         return tcb.createAsync(NavbarComponent).then((fixture) => {
           let component = fixture.componentInstance;
           let element = fixture.nativeElement;
           fixture.detectChanges();

           expect(element.querySelector('.icon-gear').parentElement).toHaveCssClass('hidden');

           component.settings = true;
           fixture.detectChanges();
           expect(element.querySelector('.icon-gear').parentElement).not.toHaveCssClass('hidden');
         });
    })));

    it('should test menu button created',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         return tcb.createAsync(NavbarComponent).then((fixture) => {
           let component = fixture.componentInstance;
           component.navData = [
             {
               'name': 'Test',
               'routeName': 'Test'
             }
           ];

           let element = fixture.nativeElement;
           fixture.detectChanges();

           expect(element.querySelector('ul li span a').parentElement).toBeDefined();
         });
    })));

    it('should test menu dropdown created',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         return tcb.createAsync(NavbarComponent).then((fixture) => {
           let component = fixture.componentInstance;
           component.navData = [
             {
               'name': 'Dropdown',
               'dropdown': [
                 {
                   'name': 'Test',
                   'routeName': 'Test'
                 }
               ]
             }
           ];

           let element = fixture.nativeElement;
           fixture.detectChanges();

           expect(element.querySelector('.mega-menu div ul li').parentElement).toBeDefined();
         });
    })));

    it('should test megamenu created',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         return tcb.createAsync(NavbarComponent).then((fixture) => {
           let component = fixture.componentInstance;
           component.navData = [
             {
               'name': 'Mega Menu',
               'dropdownMegaMenu': [
                 {
                   'name': 'Category',
                   'subMenu': [
                     {
                       'name': 'Test',
                       'routeName': 'Test'
                     }
                   ]
                 }
               ]
             }
           ];

           let element = fixture.nativeElement;
           fixture.detectChanges();

           expect(element.querySelector('.mega-menu div ul .sub-menu').parentElement).toBeDefined();
         });
    })));
  });
}
