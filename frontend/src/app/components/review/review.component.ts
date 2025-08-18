import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HelperDetailsService } from '../../services/helper-details.service'; 
import { CommonModule } from '@angular/common';
import { Helper } from '../../models/helper.interface';


@Component({
  selector: 'app-review',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
    constructor(private router: Router, private helperDetailsService: HelperDetailsService) {}
    formDetails: Helper | null = null;
    documentDetails: File | null = null;
    profileImageUrl: string | null = null;
    
    ngOnInit(){
      this.formDetails = this.helperDetailsService.getHelperDetails();
      this.documentDetails = this.helperDetailsService.getDocument();
      console.log('Form Details:', this.formDetails);
      console.log('Document Details:', this.documentDetails);
      
      
      this.processProfileImage();
    }
    
    private processProfileImage(): void {
      if (!this.formDetails?.profile) {
        this.profileImageUrl = this.getDefaultAvatar();
        return;
      }

      const profile = this.formDetails.profile;
      
     
      if (profile instanceof File) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImageUrl = e.target?.result as string;
        };
        reader.readAsDataURL(profile);
      } 
      

      else if (typeof profile === 'string' && profile.trim() !== '') {
     
        if (profile.startsWith('http')) {
          this.profileImageUrl = profile;
        } else {
          this.profileImageUrl = `http://localhost:3000/uploads/${profile}`;
        }
      } 
       
      else {
        this.profileImageUrl = this.getDefaultAvatar();
      }
    }
    
    getProfileImageUrl(): string {
      return this.profileImageUrl || this.getDefaultAvatar();
    }
    
    private getDefaultAvatar(): string {
      return 'https://avatar.iran.liara.run/public/93';
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
    
    formatDate(date: Date): string {
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
