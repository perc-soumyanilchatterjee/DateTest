import { FilterFacet } from './filter-facet.model';
import { TruncateFacetListPipe } from './truncate-facet-list.pipe';
import {
    it,
    describe,
    expect,
    beforeEach
} from '@angular/core/testing';

export function main() {
  'use strict';
  describe('LxkTruncateFacetList', () => {
    let truncateFacetList: TruncateFacetListPipe;
    let mockFacets: FilterFacet[];

    beforeEach(() => {
      truncateFacetList = new TruncateFacetListPipe();
      mockFacets = [];
      mockFacets.push({name: 'test1', matchingAssetsCount: 2});
      mockFacets.push({name: 'test2', matchingAssetsCount: 2});
      mockFacets.push({name: 'test3', matchingAssetsCount: 2});
      mockFacets.push({name: 'test4', matchingAssetsCount: 2});
      mockFacets.push({name: 'test5', matchingAssetsCount: 2});
      mockFacets.push({name: 'test6', matchingAssetsCount: 2});
    });

    it('changes nothing when showAll is true', () => {
      let testResult = truncateFacetList.transform(mockFacets, [true]);

      expect(testResult).toEqual(mockFacets);
    });

    it('truncates the list to the first 5 items when show all is false', () => {
      let testResult = truncateFacetList.transform(mockFacets, [false]);

      expect(testResult.length).toEqual(5);
      expect(testResult[0]).toEqual(mockFacets[0]);
      expect(testResult[1]).toEqual(mockFacets[1]);
      expect(testResult[2]).toEqual(mockFacets[2]);
      expect(testResult[3]).toEqual(mockFacets[3]);
      expect(testResult[4]).toEqual(mockFacets[4]);
    });

    it('performs no operation when the passed list has a length less than 5', () => {
      mockFacets = [];
      mockFacets.push({name: 'test1', matchingAssetsCount: 2});
      mockFacets.push({name: 'test2', matchingAssetsCount: 2});
      mockFacets.push({name: 'test3', matchingAssetsCount: 2});
      mockFacets.push({name: 'test4', matchingAssetsCount: 2});

      let testResult = truncateFacetList.transform(mockFacets, [true]);

      expect(testResult).toEqual(mockFacets);
    });
  });
}
