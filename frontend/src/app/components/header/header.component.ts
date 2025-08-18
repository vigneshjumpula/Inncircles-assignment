import { Component, computed } from '@angular/core';
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
  }
  visibleSort: boolean = false;
  visibleFilter: boolean = false;
  selectedSort: string = '';
  btn: boolean = true;

 
  serviceOptions: string[] = ['cleaning', 'cooking', 'babysitting', 'security', 'gardening', 'maintenance'];
  organizationOptions: string[] = ['organization1', 'organization2', 'organization3'];

  selectedServices: string[] = [];
  selectedOrganizations: string[] = [];
  
  sortOptions: SortOption[] = [
    {value: 'name-asc', viewValue: 'Helpers Name (A-Z)'},
    {value: 'joined-date', viewValue: 'Joined Date'},
  ];


  visibleCount = computed(() => this.helperDetailsService.getFilter().length);
  totalCount = computed(() => this.helperDetailsService.getHelpers().length);

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

  onSortChange(value: string) {
  this.selectedSort = value;
  this.visibleSort = false;
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

  resetFilters() {
    this.selectedServices = [];
    this.selectedOrganizations = [];
    this.searchText = "";
    this.selectedSort = "";
    const checkboxes = document.querySelectorAll('.filter-dropdown-container input[type="checkbox"]');
    checkboxes.forEach((checkbox: EventTarget) => (checkbox as HTMLInputElement).checked = false);
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


}
