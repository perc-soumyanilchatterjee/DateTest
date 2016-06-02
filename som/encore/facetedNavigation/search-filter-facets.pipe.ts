import { Pipe, PipeTransform } from '@angular/core';
import { FilterFacet } from './filter-facet.model';

@Pipe({name: 'lxkSearchFilterFacets'})
export class SearchFilterFacetsPipe implements PipeTransform {
  transform(facets: FilterFacet[], args: string[]): any[] {
    let searchString = args[0];

    if (!searchString) {
        return facets;
    }

    searchString = searchString.toLowerCase();

    let result = [];
    facets.forEach (item => {
        if (item.name.toLowerCase().includes(searchString)) {
            result.push(item);
        }
    });

    return result;
  }
}
