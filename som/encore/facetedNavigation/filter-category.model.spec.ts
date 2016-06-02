import { FilterCategory } from './filter-category.model';
import {
    it,
    describe,
    expect,
    beforeEach
} from '@angular/core/testing';

export function main() {
  'use strict';
  describe('FilterCategory', () => {
    let category;
    let multiSelectCategory;
    let singleSelectCategory;

    let TEST_FACETS = [
      {name: 't1', matchingAssetsCount: 1},
      {name: 't2', matchingAssetsCount: 2},
      {name: 't3', matchingAssetsCount: 3},
      {name: 't4', matchingAssetsCount: 4},
      {name: 't5', matchingAssetsCount: 5}
    ];

    beforeEach(() => {
      category = new FilterCategory('Test', true, []);
      multiSelectCategory =
          new FilterCategory('Test', true, JSON.parse(JSON.stringify(TEST_FACETS)));
      singleSelectCategory = new FilterCategory('Test', false, []);

    });

    it('returns selected facets in a category', () => {
      category.facets = [{name: 'Facet11', selected: true}, {name: 'Facet12'}];
      let selectedFacets = category.getSelectedFacets();
      expect(selectedFacets.length).toEqual(1);
    });

    it('returns empty array if no facets are selected', () => {
      category.facets = [{name: 'Facet11'}, {name: 'Facet12'}];
      let selectedFacets = category.getSelectedFacets();
      expect(selectedFacets.length).toEqual(0);
    });

    it('returns selected facets in their categories but leaves out categories w/no selected facets',
       () => {
          let categories = [new FilterCategory('Filter1', false, [
            {name: 'Facet11', matchingAssetsCount: 1, selected: true},
            {name: 'Facet12', matchingAssetsCount: 3}]
          ),
            new FilterCategory('Filter2', false, [
              {name: 'Facet2', matchingAssetsCount: 82}]
            )
          ];
          let selectedFilters = FilterCategory.getSelectedFacets(categories);
          expect(selectedFilters.length).toEqual(1);
          expect(selectedFilters[0].facets.length).toEqual(1);
        });

    it('returns empty array if no facets are selected', () => {
      let categories = [
        new FilterCategory('Filter1', false, [
          {name: 'Facet11', matchingAssetsCount: 4},
          {name: 'Facet12', matchingAssetsCount: 10}]
        ),
        new FilterCategory('Filter2', false, [
          {name: 'Facet2', matchingAssetsCount: 8}]
        )
      ];
      let selectedFilters = FilterCategory.getSelectedFacets(categories);
      expect(selectedFilters.length).toEqual(0);
    });

    it('deselects all Facets correctly', () => {
      category.facets = [
        {name: 't1', matchingAssetsCount: 1, selected: false},
        {name: 't2', matchingAssetsCount: 2, selected: true},
        {name: 't3', matchingAssetsCount: 3},
        {name: 't4', matchingAssetsCount: 4, selected: true},
        {name: 't5', matchingAssetsCount: 5, selected: false}
      ];
      category.selectedFacetCount = 2;

      expect(category.deselectAll()).toBe(-2);
      expect(category.selectedFacetCount).toBe(0);
      category.facets.forEach(facet => {
        expect(facet.selected).toBeFalsy();
      });
    });

    it('identifies assets it has correctly', () => {
      category.facets = [
        {name: 't1', matchingAssetsCount: 1}
      ];

      expect(category.hasFacet(category.facets[0])).toBeTruthy();
      expect(category.hasFacet({name: 'somethingElse', matchingAssetsCount: 1})).toBeFalsy();
    });

    it('sets the facets correctly', () => {
      multiSelectCategory.facets = [
        {name: 't1', matchingAssetsCount: 1, selected: false},
        {name: 't2', matchingAssetsCount: 2, selected: true},
        {name: 't3', matchingAssetsCount: 3},
        {name: 't4', matchingAssetsCount: 4, selected: true},
        {name: 't5', matchingAssetsCount: 5, selected: false}
      ];

      expect(multiSelectCategory.selectedFacetCount).toEqual(2);
    });

    it('selects and deselects specific Facets correctly', () => {
      expect(multiSelectCategory.setSelectedFacet(multiSelectCategory.facets[0], true)).toBe(1);
      expect(multiSelectCategory.setSelectedFacet(multiSelectCategory.facets[2], true)).toBe(1);
      expect(multiSelectCategory.setSelectedFacet(multiSelectCategory.facets[3], true)).toBe(1);

      expect(multiSelectCategory.selectedFacetCount).toEqual(3);
      expect(multiSelectCategory.facets[0].selected).toBeTruthy();
      expect(multiSelectCategory.facets[1].selected).toBeFalsy();
      expect(multiSelectCategory.facets[2].selected).toBeTruthy();
      expect(multiSelectCategory.facets[3].selected).toBeTruthy();
      expect(multiSelectCategory.facets[4].selected).toBeFalsy();

      expect(multiSelectCategory.setSelectedFacet(multiSelectCategory.facets[1], false)).toBe(0);
      expect(multiSelectCategory.setSelectedFacet(multiSelectCategory.facets[2], false)).toBe(-1);

      expect(multiSelectCategory.selectedFacetCount).toEqual(2);
      expect(multiSelectCategory.facets[0].selected).toBeTruthy();
      expect(multiSelectCategory.facets[1].selected).toBeFalsy();
      expect(multiSelectCategory.facets[2].selected).toBeFalsy();
      expect(multiSelectCategory.facets[3].selected).toBeTruthy();
      expect(multiSelectCategory.facets[4].selected).toBeFalsy();

      expect(multiSelectCategory.setSelectedFacet(multiSelectCategory.facets[0], true)).toBe(0);

      expect(multiSelectCategory.selectedFacetCount).toEqual(2);
      expect(multiSelectCategory.facets[0].selected).toBeTruthy();
      expect(multiSelectCategory.facets[1].selected).toBeFalsy();
      expect(multiSelectCategory.facets[2].selected).toBeFalsy();
      expect(multiSelectCategory.facets[3].selected).toBeTruthy();
      expect(multiSelectCategory.facets[4].selected).toBeFalsy();
    });

    it('sets facets correctly', () => {
      singleSelectCategory.facets = [
        {name: 't1', matchingAssetsCount: 1, selected: false},
        {name: 't2', matchingAssetsCount: 2, selected: true},
        {name: 't3', matchingAssetsCount: 3},
        {name: 't4', matchingAssetsCount: 4, selected: false},
        {name: 't5', matchingAssetsCount: 5, selected: false}
      ];

      expect(singleSelectCategory.selectedFacetCount).toEqual(1);
      expect(singleSelectCategory.selectedFacet).toBe(singleSelectCategory.facets[1]);
    });

    it('throws an error when more than one facet is selected', () => {
      let mockFacets = [
        {name: 't1', matchingAssetsCount: 1, selected: false},
        {name: 't2', matchingAssetsCount: 2, selected: true},
        {name: 't3', matchingAssetsCount: 3},
        {name: 't4', matchingAssetsCount: 4, selected: true},
        {name: 't5', matchingAssetsCount: 5, selected: false}
      ];

      expect(function () {
        singleSelectCategory.facets = mockFacets;
      }).toThrowError();
    });

    it('deselects all Facets correctly', () => {
      singleSelectCategory.facets = [
        {name: 't1', matchingAssetsCount: 1, selected: false},
        {name: 't2', matchingAssetsCount: 2, selected: true},
        {name: 't3', matchingAssetsCount: 3},
        {name: 't4', matchingAssetsCount: 4, selected: false},
        {name: 't5', matchingAssetsCount: 5, selected: false}
      ];

      expect(singleSelectCategory.deselectAll()).toBe(-1);
      expect(singleSelectCategory.selectedFacetCount).toEqual(0);
      expect(singleSelectCategory.selectedFacet).toBeFalsy();
    });

    it('selects and deselects specific Facets correctly', () => {
      singleSelectCategory.facets = [
        {name: 't1', matchingAssetsCount: 1},
        {name: 't2', matchingAssetsCount: 2},
        {name: 't3', matchingAssetsCount: 3},
        {name: 't4', matchingAssetsCount: 4},
        {name: 't5', matchingAssetsCount: 5}
      ];

      expect(singleSelectCategory.selectedFacet).toBeFalsy();
      expect(singleSelectCategory.selectedFacetCount).toEqual(0);

      expect(singleSelectCategory.setSelectedFacet(singleSelectCategory.facets[0], true))
          .toEqual(1);
      expect(singleSelectCategory.selectedFacet).toBe(singleSelectCategory.facets[0]);
      expect(singleSelectCategory.selectedFacetCount).toEqual(1);

      expect(singleSelectCategory.setSelectedFacet(singleSelectCategory.facets[3], true))
          .toEqual(0);
      expect(singleSelectCategory.selectedFacet).toBe(singleSelectCategory.facets[3]);
      expect(singleSelectCategory.selectedFacetCount).toEqual(1);

      expect(singleSelectCategory.setSelectedFacet(singleSelectCategory.facets[3], true))
          .toEqual(0);
      expect(singleSelectCategory.selectedFacet).toBe(singleSelectCategory.facets[3]);
      expect(singleSelectCategory.selectedFacetCount).toEqual(1);

      expect(singleSelectCategory.setSelectedFacet(singleSelectCategory.facets[3], false))
          .toEqual(-1);
      expect(singleSelectCategory.selectedFacet).toBeFalsy();
      expect(singleSelectCategory.selectedFacetCount).toEqual(0);
    });

  });
}
