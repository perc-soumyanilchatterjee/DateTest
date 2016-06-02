import { Pipe, PipeTransform } from '@angular/core';
import { FilterFacet } from './filter-facet.model';

@Pipe({name: 'lxkTruncateFacetList'})
export class TruncateFacetListPipe implements PipeTransform {
  private maximumListSize: number = 5;

  transform(facets: FilterFacet[], args: boolean[]): any[] {
    let showAll = args[0];

    if (showAll) {
      return facets;
    }

    if (facets.length < this.maximumListSize) {
      return facets;
    }

    return facets.slice(0, this.maximumListSize);
  }
}
