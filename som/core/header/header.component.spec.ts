import {
    it,
    describe,
    expect,
    beforeEach,
    beforeEachProviders,
    injectAsync
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

import { HeaderComponent } from './header.component';
import { HeaderData } from './header.model';

@RouteConfig([
  {path: '/test', name: 'Test', component: HeaderComponent}
])

class MyHeader extends HeaderComponent {

}

class MockRouter  {
  navigate(params) { /*intentionally empty*/ };
}

export function main() {
  'use strict';
  describe('Header', () => {
    let header: MyHeader;

    beforeEach(() => {
      header = new MyHeader;
    });

    beforeEachProviders(() => [
      ROUTER_FAKE_PROVIDERS,
      ROUTER_PROVIDERS,
      RouteRegistry,
      provide(Router, {useClass: MockRouter}),
      provide(Location, {useClass: SpyLocation}),
      provide(LocationStrategy, {useClass: MockLocationStrategy}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: MyHeader})
    ]);

    it('should test emit navClicked', () => {
      let event: String = 'test';
      header.navClick.emit = function (name) {
        expect(name).toBe(event);
      };
      header.onNavClicked(event);
    });

    it('should test emit userClicked', () => {
      let event: String = 'test';
      header.userClick.emit = function (name) {
        expect(name).toBe(event);
      };
      header.onUserClicked(event);
    });

    it('should test emit settingsClicked', () => {
      let event: String = 'test';
      header.settingsClick.emit = function (name) {
        expect(name).toBe(event);
      };
      header.onSettingsClicked(event);
    });

    it('should test waffle shows',
       injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(HeaderComponent).then((fixture) => {
          let component = fixture.componentInstance;
          let headerData: HeaderData;
          headerData = {
            appName: 'test'
          };
          component.headerData = headerData;
          fixture.detectChanges();
          let element = fixture.nativeElement;
          expect(element.querySelector('.nav_waffle')).toHaveCssClass('hidden');

          component.headerData.apps = true;
          fixture.detectChanges();
          expect(element.querySelector('.nav_waffle')).not.toHaveCssClass('hidden');
        });
    }));

    it('should test settings show',
       injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(HeaderComponent).then((fixture) => {
          let component = fixture.componentInstance;
          let headerData: HeaderData;
          headerData = {
            appName: 'test'
          };
          component.headerData = headerData;
          fixture.detectChanges();
          let element = fixture.nativeElement;
          expect(element.querySelector('.nav_settings')).toHaveCssClass('hidden');

          component.headerData.settings = true;
          fixture.detectChanges();
          expect(element.querySelector('.nav_settings')).not.toHaveCssClass('hidden');
        });
    }));

    it('should test user shows',
       injectAsync([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         return tcb.createAsync(HeaderComponent).then((fixture) => {
           let component = fixture.componentInstance;
           let headerData: HeaderData;
           headerData = {
             appName: 'test'
           };
           component.headerData = headerData;
           fixture.detectChanges();
           let element = fixture.nativeElement;
           expect(element.querySelector('.dropdown')).toBeNull();

           component.headerData.userOptions = {
             'options': [
               {
                 'name': 'Log Out'
               }
             ]
           };
           fixture.detectChanges();
           expect(element.querySelector('.dropdown')).not.toBeNull();
         });
    }));

  });
}
