import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { HelperDetailsService } from '../../services/helper-details.service';

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
  alldetails: any[] = [];
  filter: any[] = [];
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

  // Filter options
  serviceOptions: string[] = ['cleaning', 'cooking', 'babysitting', 'security', 'gardening', 'maintenance'];
  organizationOptions: string[] = ['organization1', 'organization2', 'organization3'];

  selectedServices: string[] = [];
  selectedOrganizations: string[] = [];
  
  sortOptions: SortOption[] = [
    {value: 'name-asc', viewValue: 'Helpers Name (A-Z)'},
    {value: 'joined-date', viewValue: 'Joined Date'},
  ];

  // Computed counts for displaying filter results
  visibleCount = computed(() => this.helperDetailsService.getFilter().length);
  totalCount = computed(() => this.helperDetailsService.getHelpers().length);

  toggleSidebar() {
    this.visibleSort = !this.visibleSort;
    this.visibleFilter = false; // Close filter when sort is opened
    console.log('Sidebar toggled');
  }

  toggleFilter() {
    this.visibleFilter = !this.visibleFilter;
    this.visibleSort = false; // Close sort when filter is opened
    console.log('Filter toggled');
  }

  addHelper() {
    this.helperDetailsService.setEditMode(false);
    this.router.navigate(['/add-helper']);
  }

  onSortChange(value: string) {
    this.selectedSort = value;
    // apply sort to filter[]


    // let helpers = this.helperDetailsService.getHelpers(); 

    if (value === 'name-asc') {
      this.filter.sort((a, b) => a.full_name.localeCompare(b.full_name));
      this.visibleSort = false;
    } else if (value === 'joined-date') {
      this.filter.sort((a, b) => {
        return new Date(b.joined_date).getTime() - new Date(a.joined_date).getTime();
      });
      this.visibleSort = false;
    }
    this.helperDetailsService.setHelpers(this.filter);
  }

  onServiceFilterChange(event: any) {
    const service = event.target.value;
    if (event.target.checked) {
      this.selectedServices.push(service);
    } else {
      this.selectedServices = this.selectedServices.filter(s => s !== service);
    }
  }

  onOrganizationFilterChange(event: any) {
    const org = event.target.value;
    if (event.target.checked) {
      this.selectedOrganizations.push(org);
    } else {
      this.selectedOrganizations = this.selectedOrganizations.filter(o => o !== org);
    }
  }

  resetFilters() {
    
    this.selectedServices = [];
    this.selectedOrganizations = [];
    
    const checkboxes = document.querySelectorAll('.filter-dropdown-container input[type="checkbox"]');
    checkboxes.forEach((checkbox: any) => checkbox.checked = false);
  }

  applyFilters() {
   
    let helpers = this.helperDetailsService.getHelpers();
    let filteredHelpers = this.filter;

    // Filter by services
    if (this.selectedServices.length > 0) {
      filteredHelpers = filteredHelpers.filter(helper => 
        this.selectedServices.includes(helper.type_of_service)
      );
    }

    // Filter by organizations
    if (this.selectedOrganizations.length > 0) {
      filteredHelpers = filteredHelpers.filter(helper => 
        this.selectedOrganizations.includes(helper.organization_name)
      );
    }
    console.log('Filtered helpers:', filteredHelpers);
    this.helperDetailsService.setFilter(filteredHelpers);
    this.visibleFilter = false;
    console.log('Filters applied:', { services: this.selectedServices, organizations: this.selectedOrganizations });

  
  // End of applyFilters
  
  }
  // add the filter 
   searchText:string ="";
   onSearchChange(){
       const text=this.searchText.trim().toLowerCase();
      //  let helpers=this.helperDetailsService.getHelpers();
      let helpers = this.filter;
       if(text){
        const filtered=helpers.filter(h=>
            (h.full_name && h.full_name.toLowerCase().includes(text)) || 
            (h.type_of_service && h.type_of_service.toLowerCase().includes(text)) ||
            (h.phone_number  && h.phone_number.toString().includes(text))
        )
        this.helperDetailsService.setFilter(filtered);
       }
       else {
         this.helperDetailsService.setFilter(this.alldetails);
       }
      }


}
