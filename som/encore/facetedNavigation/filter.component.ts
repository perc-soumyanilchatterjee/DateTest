import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FORM_DIRECTIVES } from '@angular/common';
import { CollapseDirective } from 'ng2-bootstrap/ng2-bootstrap';
import { FilterFacet } from './filter-facet.model';
import { FilterCategory } from './filter-category.model';
import { SearchFilterFacetsPipe } from './search-filter-facets.pipe';
import { TruncateFacetListPipe } from './truncate-facet-list.pipe';

@Component({
  selector: 'lxk-filter',
  directives: [FORM_DIRECTIVES, CollapseDirective],
  pipes: [SearchFilterFacetsPipe, TruncateFacetListPipe],
  template: `
  <div class="col-xs-12 filter-container">
    <div class="row h5 filter-header-first">
      <span *ngIf="totalFacetsSelectedCount > 0" role="button" class="margin-left-minus20"
          (click)="isHeaderCollapsed = !isHeaderCollapsed">
        <i class="glyphicon" [class.icon-triangle_right]="isHeaderCollapsed"
            [class.icon-triangle_bottom]="!isHeaderCollapsed"></i>
      </span>
      <span>Filter</span>
      <button class="pull-right btn-link clear-link" [disabled]="totalFacetsSelectedCount == 0"
          (click)="clearAll()">Clear All</button>
    </div>
    <div class="filter">
      <!-- List of currently selected facets -->
      <ul class="list-group list-unstyled" [collapse]="isHeaderCollapsed">
        <div *ngFor="let category of inputCategories">
          <div *ngFor="let facet of category.facets">
            <li class="list-group-item" *ngIf="facet.selected">
              {{ facet.name }}&nbsp;({{ facet.matchingAssetsCount }})
              <span class="pull-right">
                <i class="glyphicon icon-close clear-x" role="button"
                    (click)="onChange(category, facet, false)"></i>
              </span>
            </li>
          </div>
        </div>
      </ul>
    </div>
    <!-- List of all categories and facets -->
    <div class="filter" *ngFor="let category of inputCategories">
      <!-- Category header -->
      <div class="row h5 filter-header">
        <span (click)="category.isCollapsed = !category.isCollapsed" role="button">
          <i class="glyphicon" [class.icon-triangle_right]="category.isCollapsed"
              [class.icon-triangle_bottom]="!category.isCollapsed"></i>
          {{ category.name }}&nbsp;
          <span *ngIf="category.selectedFacetCount != 0">({{category.selectedFacetCount}})</span>
        </span>
        <button class="pull-right btn-link clear-link" [disabled]="category.selectedFacetCount == 0"
            (click)="clearSelected(category)">Clear</button>
      </div>
      <div [collapse]="category.isCollapsed">
        <!-- Facet search bar -->
        <div *ngIf="category.facets.length > expandFiltersToModal">
          <i class="glyphicon icon-search"></i>
          <input #input type="search" [(ngModel)]="category.facetSearchString">
          <i role="button" class="glyphicon icon-close clear-x" role="button"
              (click)="category.facetSearchString=''"></i>
        </div>
        <!-- MultiSelect Category Facet List -->
        <ul class="list-group" *ngIf="isMultiSelect(category)">
          <li *ngFor="let facet of category.facets
              | lxkSearchFilterFacets:category.facetSearchString
              | lxkTruncateFacetList:category.showAll" class="list-group-item">
            <span>
              <input #checkbox type="checkbox" [checked]="facet.selected"
                  (change)="onChange(category, facet, checkbox.checked)"/>
              <span>{{ facet.name }}&nbsp;({{ facet.matchingAssetsCount }})</span>
            </span>
          </li>
        </ul>
        <!-- SingleSelect Category Facet List -->
        <ul class="list-group" *ngIf="isSingleSelect(category)">
          <li *ngFor="let facet of category.facets
              | lxkSearchFilterFacets:category.facetSearchString
              | lxkTruncateFacetList:category.showAll" class="white list-group-item">
            <span role="button" (click)="onChange(category, facet, true)"
                [class.single-facet-selected]="facet.selected"
                [class.single-facet-unselected]="!facet.selected">
              {{ facet.name }}&nbsp;({{ facet.matchingAssetsCount }})
            </span>
          </li>
        </ul>

        <!-- Facet show more controls -->
        <div *ngIf="category.facets.length > showMoreFacets">
          <div *ngIf="category.facets.length <= expandFiltersToModal">
            <button class="btn btn-link show-more-link" (click)="category.showAll=!category.showAll"
                *ngIf="!category.showAll">Show More...</button>
            <button class="btn btn-link show-more-link" (click)="category.showAll=!category.showAll"
                *ngIf="category.showAll">Show Less...</button>
          </div>
          <div *ngIf="category.facets.length > expandFiltersToModal">
            <button class="btn btn-link show-more-link"
                (click)="openModal(category)">Show More...</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class FilterComponent {

  @Input('categories') inputCategories: FilterCategory[] = [];
  @Output() filterChange: EventEmitter<FilterCategory[]>;

  private expandFiltersToModal: number = 23;
  private isHeaderCollapsed: boolean = false;
  private showMoreFacets: number = 5;
  private totalFacetsSelectedCount: number = 0;

  constructor() {
    this.filterChange = new EventEmitter();
  }

  get categories(): FilterCategory[] {
    return this.inputCategories;
  }

  set categories(categories: FilterCategory[]) {
    this.inputCategories = categories;

    this.totalFacetsSelectedCount = 0;
    this.inputCategories.forEach (category => {
      category.facets.forEach (facet => {
        if (facet.selected) {
          category.selectedFacetCount++;
          this.totalFacetsSelectedCount++;
        }
      });
    });
  }

  private clearAll(): void {
    this.inputCategories.forEach (category => {
      let change = category.deselectAll();
      this.totalFacetsSelectedCount += change;
    });

    this.emitFilterChange();
  }

  private clearSelected(category): void {
    this.totalFacetsSelectedCount += category.deselectAll();
    this.emitFilterChange();
  }

  private emitFilterChange(): void {
    let facets = FilterCategory.getSelectedFacets(this.inputCategories);
    this.filterChange.emit(facets);
  }

  private isSingleSelect(category: FilterCategory): boolean {
    return !category.isMultiSelect;
  }

  private isMultiSelect(category: FilterCategory): boolean {
    return category.isMultiSelect;
  }

  private onChange(category: FilterCategory, selectedFacet: FilterFacet, selected: boolean): void {
    this.totalFacetsSelectedCount += category.setSelectedFacet(selectedFacet, selected);
    this.emitFilterChange();
  }

  private openModal(category): void {
    alert('We should show a modal here, but ng2-bootstrap doesnt have that yet, so we dont');
  }
}
