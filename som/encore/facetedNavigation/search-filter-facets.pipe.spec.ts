import { SearchFilterFacetsPipe } from './search-filter-facets.pipe';
import { FilterFacet } from './filter-facet.model';
import {
    it,
    describe,
    expect,
    beforeEach
} from '@angular/core/testing';

export function main() {
  'use strict';
  describe('LxkSearchFilterFacets', () => {
    let searchFilterFacets: SearchFilterFacetsPipe;
    let mockFacets: FilterFacet[];

    beforeEach(() => {
      searchFilterFacets = new SearchFilterFacetsPipe();
      mockFacets = [];
      mockFacets.push({name: 'c', matchingAssetsCount: 2});
      mockFacets.push({name: 'abcdefghijklmnopqrstuvwxyz1234567890', matchingAssetsCount: 2});
      mockFacets.push({name: 'C', matchingAssetsCount: 2});
      mockFacets.push({name: '', matchingAssetsCount: 2});
      mockFacets.push({name: '1', matchingAssetsCount: 2});
    });

    it('filters away nothing on null', () => {
      let testResult = searchFilterFacets.transform(mockFacets, []);

      expect(testResult).toEqual(mockFacets);
    });

    it('filters away nothing on an empty string', () => {
      let testResult = searchFilterFacets.transform(mockFacets, ['']);
      expect(testResult).toEqual(mockFacets);
    });

    it('filters correctly', () => {
      let testResult = searchFilterFacets.transform(mockFacets, ['abc']);
      expect(testResult.length).toEqual(1);
      expect(testResult[0]).toEqual(mockFacets[1]);
    });

    it('filters case insensively', () => {
      let testResult = searchFilterFacets.transform(mockFacets, ['c']);
      expect(testResult.length).toEqual(3);
      expect(testResult[0]).toEqual(mockFacets[0]);
      expect(testResult[1]).toEqual(mockFacets[1]);
      expect(testResult[2]).toEqual(mockFacets[2]);
    });

    it('cannot find search string', () => {
      let testResult = searchFilterFacets.transform(mockFacets, ['az']);
      expect(testResult.length).toEqual(0);
    });
  });
}
