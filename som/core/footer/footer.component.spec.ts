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
import { RootRouter } from '@angular/router-deprecated/src/router';

import { FooterComponent } from './footer.component';

@RouteConfig([
  {path: '/test', name: 'Test', component: FooterComponent}
])

class MyFooter extends FooterComponent {

}

export function main() {
  'use strict';
  describe('FooterComponent', () => {

    let footer: MyFooter;

    beforeEach(() => {
      footer = new MyFooter();
    });

    beforeEachProviders(() => [
      ROUTER_PROVIDERS,
      ROUTER_FAKE_PROVIDERS,
      RouteRegistry,
      provide(Router, { useClass: RootRouter }),
      provide(Location, {useClass: SpyLocation}),
      provide(LocationStrategy, {useClass: MockLocationStrategy}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: MyFooter})
    ]);

    it('should have an editable help route name', () => {
      let name = 'Test';
      footer.helpRouteName = name;
      expect(footer.helpRouteName).toBe(name);
    });

    it('should test emit helpClick', () => {
      footer.helpClick.emit = function (name) {
        expect(name).toBe(footer.helpRouteName);
      };
      footer.helpRouteName = 'emitted';
      footer.onClick(footer.helpRouteName);
    });

    it('should test getOffset', () => {
      expect(footer.getOffset()).toBe('col-sm-offset-3');

      footer.helpRouteName = 'test';
      expect(footer.getOffset()).toBeUndefined();
    });

    it('should test help shows',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(FooterComponent).then((fixture) => {
          fixture.detectChanges();
          let element = fixture.nativeElement;
          let component = fixture.componentInstance;
          expect(element.querySelector('a')).toHaveCssClass('hidden');

          component.helpRouteName = './Test';
          fixture.detectChanges();
          expect(element.querySelector('a').innerText).toBe('Help');
          expect(element.querySelector('a')).not.toHaveCssClass('hidden');
        });
    })));
  });
}
