import { FilterFacet } from './filter-facet.model';

export class FilterCategory {
  name: string;
  selectedFacetCount: number = 0;
  isCollapsed: boolean = false;
  facetSearchString: string = '';
  showAll: boolean = false;
  allFacets: FilterFacet[] = [];
  isMultiSelect: boolean = true;
  selectedFacet: FilterFacet; // used for single select categories

  static getSelectedFacets(categories: FilterCategory[]): FilterCategory[] {
    let selected = [];
    categories.forEach(category => {
      let selectedFacets = category.getSelectedFacets();
      if (selectedFacets.length > 0) {
        let categoryCopy: FilterCategory = category.shallowClone();
        categoryCopy.facets = selectedFacets;
        categoryCopy.selectedFacetCount = selectedFacets.length;
        selected.push(categoryCopy);
      }
    });
    return selected;
  }

  private static deepCopy(o: any): any {
    return JSON.parse(JSON.stringify(o));
  }

  constructor(name: string, isMultiSelect: boolean, facets: FilterFacet[]) {
    this.name = name;
    this.isMultiSelect = isMultiSelect;
    this.facets = facets;
  }

  get facets() {
    return this.allFacets;
  }

  set facets(facets: FilterFacet[]) {
    this.allFacets = facets;
    this.onSetFacets(facets);
  }

  deselectAll(): number {
    if (!this.isMultiSelect) {
      this.selectedFacet = undefined;
    }

    if (!this.selectedFacetCount) {
      return 0;
    }

    this.facets.forEach(facet => {
      facet.selected = false;
    });

    let oldFacetCount = this.selectedFacetCount;
    this.selectedFacetCount = 0;

    return -oldFacetCount;
  };

  hasFacet(facet: FilterFacet): boolean {
    let facetFound = false;
    this.facets.forEach(objectFacet => {
      if (objectFacet === facet) {
        facetFound = true;
      }
    });

    return facetFound;
  }

  protected onSetFacets(facets: FilterFacet[]): void {
    this.selectedFacetCount = 0;
    facets.forEach(facet => {
      if (facet.selected) {
        if (!this.isMultiSelect) {
          this.selectedFacet = facet;
        }
        this.selectedFacetCount++;
      }
    });

    if (!this.isMultiSelect) {
      if (this.selectedFacetCount > 1) {
        throw new Error('FilterCategorySingleSelect facets should not ' +
            'have more than 1 selected facet when set');
      }
    }
  };

  shallowClone(): FilterCategory {
    return new FilterCategory(this.name, this.isMultiSelect, this.facets);
  };

  /**
   * Sets the provided FitlerFacet object's selected value to the passed value and updates
   * the selectedFacetCount the <code>this</code>. Should also update
   * <code>selectedFacetCount</code> as appropriate.
   * @param facet The facet to change
   * @param selectedValue The selected value to set the <code>facet</code>
   * @return The amount by which selectedFacetCount changed during this operation
   */
  setSelectedFacet(facet: FilterFacet, selectedValue: boolean): number {
    if (!this.hasFacet(facet)) {
      throw new Error('The facet ' + facet + ' does not exist in this category');
    }

    if ((facet.selected && selectedValue) || (!facet.selected && !selectedValue)) {
      return 0;
    }

    if (this.isMultiSelect) {
      facet.selected = selectedValue;
      if (selectedValue) {
        this.selectedFacetCount++;
        return 1;
      } else {
        this.selectedFacetCount--;
        return -1;
      }
    } else {
      let countChange = 0;
      if (!this.selectedFacet && selectedValue) {
        this.selectedFacet = facet;
        countChange = 1;
      } else if (this.selectedFacet && selectedValue) {
        this.selectedFacet.selected = false;
        this.selectedFacet = facet;
        countChange = 0;
      } else if (this.selectedFacet && !selectedValue) {
        this.selectedFacet.selected = false;
        this.selectedFacet = undefined;
        countChange = -1;
      }

      facet.selected = selectedValue;

      if (this.selectedFacet && this.selectedFacet.selected) {
        this.selectedFacetCount = 1;
      } else {
        this.selectedFacetCount = 0;
      }

      return countChange;
    }
  };

  getSelectedFacets(): FilterFacet[] {
    let selectedFacets = [];
    this.facets.forEach(facet => {
      if (facet.selected) {
        let facetCopy: FilterFacet = FilterCategory.deepCopy(facet);
        selectedFacets.push(facetCopy);
      }
    });
    return selectedFacets;
  }
}
