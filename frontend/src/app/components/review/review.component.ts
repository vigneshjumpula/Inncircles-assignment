import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HelperDetailsService } from '../../services/helper-details.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
    constructor(private router: Router, private helperDetailsService: HelperDetailsService) {}
    formDetails?: any;
    documentDetails?: any;
    
    ngOnInit(){
      this.formDetails = this.helperDetailsService.getHelperDetails();
      this.documentDetails = this.helperDetailsService.getDocument();
      console.log('Form Details:', this.formDetails);
      console.log('Document Details:', this.documentDetails);
    }
    
    submitReview() {
      this.helperDetailsService.addHelper().subscribe({
        next: (response) => {
          console.log('Helper added successfully:', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error adding helper:', error);
        }
      });
    }
    
    goToDocument() {
      this.router.navigate(['/add-helper/helper/document']);
    }
    
    goToForm() {
      this.router.navigate(['/add-helper/helper/form']);
    }
    
    // Helper methods similar to right component
    getInitials(fullName: string): string {
      if (!fullName) return 'NA';
      const names = fullName.split(' ');
      const initials = names.map(name => name.charAt(0).toUpperCase()).join('');
      return initials.substring(0, 2);
    }

    getAvatarColor(fullName: string): string {
      const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
        '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
      ];
      const index = fullName ? fullName.length % colors.length : 0;
      return colors[index];
    }

    formatDate(date: any): string {
      if (!date) return '-';
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
    
    getLanguagesDisplay(): string {
      if (!this.formDetails?.languages) return '-';
      if (typeof this.formDetails.languages === 'string') {
        return this.formDetails.languages.split(',').join(', ');
      }
      return Array.isArray(this.formDetails.languages) ? 
        this.formDetails.languages.join(', ') : 
        this.formDetails.languages;
    }
}
