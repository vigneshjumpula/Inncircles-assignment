import { Component, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HelperDetailsService } from '../../services/helper-details.service';
import {Helper} from '../../models/helper.interface';

interface SortOption {
  value: string;
  viewValue: string;
  tag?: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  alldetails: Helper[] = [];
  filter: Helper[] = [];
  constructor(
    private router: Router,
    private helperDetailsService: HelperDetailsService
  ) {
     this.alldetails = this.helperDetailsService.getHelpers();
      this.helperDetailsService.setFilter(this.alldetails);
      this.filter = this.helperDetailsService.getHelpers();
      this.filterServices();
      this.filterOrganizations();
  }
  visibleSort: boolean = false;
  visibleFilter: boolean = false;
  selectedSort: string = 'name-asc';
  btn: boolean = true;

 
  serviceOptions: string[] = ['maid', 'cleaning', 'cooking', 'babysitting', 'security', 'gardening', 'maintenance'];
  organizationOptions: string[] = ['organization1', 'organization2', 'organization3'];

  selectedServices: string[] = [];
  selectedOrganizations: string[] = [];
  selectedServiceFilter: string = '';
  selectedOrganizationFilter: string = '';
  
  serviceDropdownOpen: boolean = false;
  serviceSearchText: string = '';
  filteredServiceOptions: string[] = [];
  
  organizationDropdownOpen: boolean = false;
  organizationSearchText: string = '';
  filteredOrganizationOptions: string[] = [];
  
  sortOptions: SortOption[] = [
    {value: 'name-asc', viewValue: 'Helpers Name(A-Z)'},
    {value: 'employee-id', viewValue: 'Employee ID'}
  ];


  visibleCount = computed(() => this.helperDetailsService.getFilter().length);
  totalCount = computed(() => this.helperDetailsService.getHelpers().length);

  // Check if any filters are applied for the indicator dot
  hasActiveFilters(): boolean {
    return this.selectedServices.length > 0 || 
           this.selectedOrganizations.length > 0;
  }

  toggleSidebar() {
    this.visibleSort = !this.visibleSort;
    this.visibleFilter = false; 
    console.log('Sidebar toggled');
  }

  toggleFilter() {
    this.visibleFilter = !this.visibleFilter;
    this.visibleSort = false; 
    console.log('Filter toggled');
  }

  addHelper() {
    this.helperDetailsService.setEditMode(false);
    this.router.navigate(['/add-helper']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    
 
    if (!target.closest('.sort-button-container')) {
      this.visibleSort = false;
    }
    
  
    if (!target.closest('.filter-button-container')) {
      this.visibleFilter = false;
    }
    
   
    if (!target.closest('.service-multiselect')) {
      this.serviceDropdownOpen = false;
    }
    

    if (!target.closest('.organization-multiselect')) {
      this.organizationDropdownOpen = false;
    }
  }

  onSortChange(value: string) {
  this.selectedSort = value;
  this.visibleSort = false;
  this.applyAllFilters();
  }

  onSortOptionSelect(value: string, closeDropdown: boolean = true) {
    this.selectedSort = value;
    if (closeDropdown) {
      this.visibleSort = false;
    }
    this.applyAllFilters();
  }

  onServiceFilterChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const service = target.value;
    if (target.checked) {
      this.selectedServices.push(service);
    } else {
      this.selectedServices = this.selectedServices.filter(s => s !== service);
    }
    this.applyAllFilters();
  }

  onOrganizationFilterChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const org = target.value;
    if (target.checked) {
      this.selectedOrganizations.push(org);
    } else {
      this.selectedOrganizations = this.selectedOrganizations.filter(o => o !== org);
    }
    this.applyAllFilters();
  }

  onServiceDropdownChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const service = target.value;
    if (service) {
      this.selectedServices = [service];
    } else {
      this.selectedServices = [];
    }
    this.applyAllFilters();
  }

  onOrganizationDropdownChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const org = target.value;
    if (org) {
      this.selectedOrganizations = [org];
    } else {
      this.selectedOrganizations = [];
    }
    this.applyAllFilters();
  }

  toggleServiceDropdown() {
    this.serviceDropdownOpen = !this.serviceDropdownOpen;
  }

  filterServices() {
    let filteredOptions: string[];
    
    if (!this.serviceSearchText.trim()) {
      filteredOptions = [...this.serviceOptions];
    } else {
      filteredOptions = this.serviceOptions.filter(service =>
        service.toLowerCase().includes(this.serviceSearchText.toLowerCase())
      );
    }
    
    // Group selected options at the top
    const selectedOptions = filteredOptions.filter(service => this.selectedServices.includes(service));
    const unselectedOptions = filteredOptions.filter(service => !this.selectedServices.includes(service));
    
    this.filteredServiceOptions = [...selectedOptions, ...unselectedOptions];
  }

  onServiceCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const service = target.value;
    
    if (target.checked) {
      if (!this.selectedServices.includes(service)) {
        this.selectedServices.push(service);
      }
    } else {
      this.selectedServices = this.selectedServices.filter(s => s !== service);
    }
    
    // Re-filter to group selected options at top
    this.filterServices();
    this.applyAllFilters();
  }

  areAllServicesSelected(): boolean {
    return this.filteredServiceOptions.length > 0 && 
           this.filteredServiceOptions.every(service => this.selectedServices.includes(service));
  }

  areSomeServicesSelected(): boolean {
    return this.selectedServices.length > 0 && !this.areAllServicesSelected();
  }

  toggleAllServices(event: Event) {
    const target = event.target as HTMLInputElement;
    
    if (this.areAllServicesSelected()) {
      // Deselect all filtered services
      this.selectedServices = this.selectedServices.filter(service => 
        !this.filteredServiceOptions.includes(service)
      );
    } else {
      // Select all filtered services
      this.filteredServiceOptions.forEach(service => {
        if (!this.selectedServices.includes(service)) {
          this.selectedServices.push(service);
        }
      });
    }
    this.applyAllFilters();
  }

  resetServiceFilter() {
    this.selectedServices = [];
    this.serviceSearchText = '';
    this.filterServices();
    this.applyAllFilters();
  }

  resetOrganizationFilter() {
    this.selectedOrganizationFilter = '';
    this.selectedOrganizations = [];
    this.organizationSearchText = '';
    this.filterOrganizations();
    this.applyAllFilters();
  }

  toggleOrganizationDropdown() {
    this.organizationDropdownOpen = !this.organizationDropdownOpen;
  }

  filterOrganizations() {
    let filteredOptions: string[];
    
    if (!this.organizationSearchText.trim()) {
      filteredOptions = [...this.organizationOptions];
    } else {
      filteredOptions = this.organizationOptions.filter(org =>
        org.toLowerCase().includes(this.organizationSearchText.toLowerCase())
      );
    }
    
    // Group selected options at the top
    const selectedOptions = filteredOptions.filter(org => this.selectedOrganizations.includes(org));
    const unselectedOptions = filteredOptions.filter(org => !this.selectedOrganizations.includes(org));
    
    this.filteredOrganizationOptions = [...selectedOptions, ...unselectedOptions];
  }

  onOrganizationCheckboxChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const organization = target.value;
    
    if (target.checked) {
      if (!this.selectedOrganizations.includes(organization)) {
        this.selectedOrganizations.push(organization);
      }
    } else {
      this.selectedOrganizations = this.selectedOrganizations.filter(o => o !== organization);
    }
    
    // Re-filter to group selected options at top
    this.filterOrganizations();
    this.applyAllFilters();
  }

  areAllOrganizationsSelected(): boolean {
    return this.filteredOrganizationOptions.length > 0 && 
           this.filteredOrganizationOptions.every(org => this.selectedOrganizations.includes(org));
  }

  areSomeOrganizationsSelected(): boolean {
    return this.selectedOrganizations.length > 0 && !this.areAllOrganizationsSelected();
  }

  toggleAllOrganizations(event: Event) {
    const target = event.target as HTMLInputElement;
    
    if (this.areAllOrganizationsSelected()) {
      // Deselect all filtered organizations
      this.selectedOrganizations = this.selectedOrganizations.filter(org => 
        !this.filteredOrganizationOptions.includes(org)
      );
    } else {
      // Select all filtered organizations
      this.filteredOrganizationOptions.forEach(org => {
        if (!this.selectedOrganizations.includes(org)) {
          this.selectedOrganizations.push(org);
        }
      });
    }
    this.applyAllFilters();
  }

  resetFilters() {
    this.selectedServices = [];
    this.selectedOrganizations = [];
    this.selectedServiceFilter = '';
    this.selectedOrganizationFilter = '';
    this.serviceSearchText = '';
    this.organizationSearchText = '';
    this.filteredServiceOptions = [...this.serviceOptions];
    this.filteredOrganizationOptions = [...this.organizationOptions];
    this.serviceDropdownOpen = false;
    this.organizationDropdownOpen = false;
    this.searchText = "";
    this.selectedSort = "name-asc";
    this.applyAllFilters();
  }

  applyFilters() {
    this.visibleFilter = false;
    this.applyAllFilters();
  }

   searchText:string ="";
   
   
   applyAllFilters() {
     let helpers = [...this.alldetails];

   
     const text = this.searchText.trim().toLowerCase();
     if (text) {
       helpers = helpers.filter(h =>
         (h.full_name && h.full_name.toLowerCase().includes(text)) ||
         (h.type_of_service && h.type_of_service.toLowerCase().includes(text)) ||
         (h.phone_number && h.phone_number.toString().includes(text))
       );
     }


     if (this.selectedServices.length > 0) {
       helpers = helpers.filter(h => this.selectedServices.includes(h.type_of_service));
     }

     
     if (this.selectedOrganizations.length > 0) {
       helpers = helpers.filter(h => this.selectedOrganizations.includes(h.organization_name));
     }

   
     if (this.selectedSort === 'name-asc') {
       helpers.sort((a, b) => a.full_name.localeCompare(b.full_name));
     } else if (this.selectedSort === 'joined-date') {
       helpers.sort((a, b) => 
         new Date(b.joined_date ?? 0).getTime() - new Date(a.joined_date ?? 0).getTime()
       );
     }


     this.helperDetailsService.setFilter(helpers);
   }

   onSearchChange(){
     this.applyAllFilters();
   }

   clearSearch(){
    this.searchText = '';
    this.applyAllFilters();
   }


}
