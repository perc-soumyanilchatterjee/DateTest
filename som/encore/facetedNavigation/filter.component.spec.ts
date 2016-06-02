import { FilterComponent } from './filter.component';
import { FilterCategory } from './filter-category.model';
import {
    it,
    describe,
    expect,
    beforeEach,
    async,
    inject
} from '@angular/core/testing';
import { TestComponentBuilder } from '@angular/compiler/testing';

export function main() {
  'use strict';
  describe('Filter', () => {
    let filter;

    beforeEach(() => {
      filter = new FilterComponent();
    });

    it('sets categories with selected facets correctly', () => {
      filter.categories = [
        new FilterCategory('Filter1', true, [
          {name: 'Facet11', matchingAssetsCount: 5},
          {name: 'Facet14', matchingAssetsCount: 78, selected: true},
          {name: 'Facet15', matchingAssetsCount: 1, selected: true}]),
        new FilterCategory('FilterSingle', false, [
          {name: 'FacetS1', matchingAssetsCount: 1},
          {name: 'FacetS2', matchingAssetsCount: 2, selected: true},
          {name: 'FacetS4', matchingAssetsCount: 4}])
      ];

      expect(filter.totalFacetsSelectedCount).toBe(3);
    });

    it('selects and deselects filter facets correctly', () => {
      filter.categories = [
        new FilterCategory('Filter1', true, [
          {name: 'Facet11', matchingAssetsCount: 5},
          {name: 'Facet14', matchingAssetsCount: 78},
          {name: 'Facet15', matchingAssetsCount: 1}]),
        new FilterCategory('FilterSingle', false, [
          {name: 'FacetS1', matchingAssetsCount: 1},
          {name: 'FacetS2', matchingAssetsCount: 2},
          {name: 'FacetS4', matchingAssetsCount: 4}])
      ];

      filter.onChange(filter.categories[0], filter.categories[0].facets[1], true);
      filter.onChange(filter.categories[0], filter.categories[0].facets[0], true);
      filter.onChange(filter.categories[1], filter.categories[1].facets[1], true);
      expect(filter.totalFacetsSelectedCount).toBe(3);

      filter.onChange(filter.categories[1], filter.categories[1].facets[0], true);
      expect(filter.totalFacetsSelectedCount).toBe(3);

      filter.onChange(filter.categories[1], filter.categories[1].facets[0], false);
      expect(filter.totalFacetsSelectedCount).toBe(2);

      filter.onChange(filter.categories[0], filter.categories[0].facets[0], false);
      expect(filter.totalFacetsSelectedCount).toBe(1);
    });

    it('clears facets correctly', () => {
      filter.categories = [
        new FilterCategory('Filter1', true, [
          {name: 'Facet11', matchingAssetsCount: 5},
          {name: 'Facet14', matchingAssetsCount: 78},
          {name: 'Facet15', matchingAssetsCount: 1}]),
        new FilterCategory('FilterSingle', false, [
          {name: 'FacetS1', matchingAssetsCount: 1},
          {name: 'FacetS2', matchingAssetsCount: 2},
          {name: 'FacetS4', matchingAssetsCount: 4}])
      ];

      filter.onChange(filter.categories[0], filter.categories[0].facets[1], true);
      filter.onChange(filter.categories[0], filter.categories[0].facets[0], true);
      filter.onChange(filter.categories[1], filter.categories[1].facets[1], true);

      filter.clearSelected(filter.categories[0]);
      expect(filter.totalFacetsSelectedCount).toBe(1);
      expect(filter.categories[0].selectedFacetCount).toBe(0);
      expect(filter.categories[1].selectedFacetCount).toBe(1);

      filter.clearSelected(filter.categories[1]);
      expect(filter.totalFacetsSelectedCount).toBe(0);
      expect(filter.categories[0].selectedFacetCount).toBe(0);
      expect(filter.categories[1].selectedFacetCount).toBe(0);

      filter.onChange(filter.categories[0], filter.categories[0].facets[0], true);
      filter.onChange(filter.categories[0], filter.categories[0].facets[1], true);
      filter.onChange(filter.categories[1], filter.categories[1].facets[1], true);

      expect(filter.totalFacetsSelectedCount).toBe(3);
      filter.clearAll();
      expect(filter.totalFacetsSelectedCount).toBe(0);
      expect(filter.categories[0].selectedFacetCount).toBe(0);
      expect(filter.categories[1].selectedFacetCount).toBe(0);
    });

    it('if more than 5 facets, verify button to show more exists',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb.createAsync(FilterComponent).then((fixture) => {
          let component = fixture.componentInstance;
          component.categories = [new FilterCategory('Filter1', true, [
            {name: 'Facet11', matchingAssetsCount: 5},
            {name: 'Facet14', matchingAssetsCount: 78},
            {name: 'Facet16', matchingAssetsCount: 7},
            {name: 'Facet17', matchingAssetsCount: 23},
            {name: 'Facet18', matchingAssetsCount: 14},
            {name: 'Facet15', matchingAssetsCount: 1}])];

          fixture.detectChanges();
          let element = fixture.nativeElement;
          expect(element.querySelector('div div div div div button').innerHTML)
              .toBe('Show More...');
        });
    })));

    it('if more than 23 facets, verify button to show more exists',
       async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
         return tcb.createAsync(FilterComponent).then((fixture) => {
           let component = fixture.componentInstance;
           component.categories = [new FilterCategory('Filter1', true, [
             {name: 'Facet1', matchingAssetsCount: 5},
             {name: 'Facet2', matchingAssetsCount: 78},
             {name: 'Facet3', matchingAssetsCount: 7},
             {name: 'Facet4', matchingAssetsCount: 23},
             {name: 'Facet5', matchingAssetsCount: 14},
             {name: 'Facet6', matchingAssetsCount: 14},
             {name: 'Facet7', matchingAssetsCount: 14},
             {name: 'Facet8', matchingAssetsCount: 14},
             {name: 'Facet9', matchingAssetsCount: 14},
             {name: 'Facet10', matchingAssetsCount: 14},
             {name: 'Facet11', matchingAssetsCount: 14},
             {name: 'Facet12', matchingAssetsCount: 14},
             {name: 'Facet13', matchingAssetsCount: 14},
             {name: 'Facet14', matchingAssetsCount: 14},
             {name: 'Facet15', matchingAssetsCount: 14},
             {name: 'Facet16', matchingAssetsCount: 14},
             {name: 'Facet17', matchingAssetsCount: 14},
             {name: 'Facet18', matchingAssetsCount: 14},
             {name: 'Facet19', matchingAssetsCount: 14},
             {name: 'Facet20', matchingAssetsCount: 14},
             {name: 'Facet21', matchingAssetsCount: 14},
             {name: 'Facet22', matchingAssetsCount: 14},
             {name: 'Facet23', matchingAssetsCount: 14},
             {name: 'Facet24', matchingAssetsCount: 1}])];

           fixture.detectChanges();
           let element = fixture.nativeElement;
           expect(element.querySelector('div div div div div button').innerHTML)
               .toBe('Show More...');
         });
    })));
  });
}
