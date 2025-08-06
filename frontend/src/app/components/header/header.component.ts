import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';

interface SortOption {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private router: Router) {}
  visibleSort : boolean=false;
  selectedSort: string = 'name-asc';
  
  sortOptions: SortOption[] = [
    {value: 'name-asc', viewValue: 'Sort by Name (A-Z)'},
    {value: 'name-desc', viewValue: 'Sort by Name (Z-A)'},
    {value: 'employee-id', viewValue: 'Sort by Employee ID'},
    {value: 'phone', viewValue: 'Sort by Phone'},
  ];

  toggleSidebar() {
    this.visibleSort = !this.visibleSort;
    console.log('Sidebar toggled');
  }

  addHelper() {
    this.router.navigate(['/add-helper']);
  }

  onSortChange(value: string) {
    console.log('Sort changed to:', value);
    // Add your sorting logic here
  }
}
