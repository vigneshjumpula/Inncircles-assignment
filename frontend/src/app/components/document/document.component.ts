import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HelperDetailsService } from '../../services/helper-details.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-document',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule],
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent {
  docment?: any;

  constructor(private router: Router, private helperDetailsService: HelperDetailsService) {}

  submitDocument() {
    // Save document to service (can be null if no document uploaded)
    this.helperDetailsService.Document = this.docment || null;
    console.log('Document submitted:', this.docment ? 'Document uploaded' : 'No document uploaded');
    
    // Check if we're in edit mode
    if (this.helperDetailsService.getEditMode()) {
      console.log('In edit mode, attempting to update helper...');
      console.log('Edit mode helper ID:', this.helperDetailsService.getEditingHelperId());
      console.log('Helper details to update:', this.helperDetailsService.getHelperDetails());
      
      // In edit mode, directly update the helper
      this.helperDetailsService.addHelper().subscribe({
        next: (response) => {
          console.log('Helper updated successfully:', response);
          // Clear edit mode after successful update
          this.helperDetailsService.setEditMode(false);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error updating helper:', error);
          console.error('Full error object:', error);
          const errorMessage = error.error?.message || error.message || 'Unknown error occurred';
          alert('Failed to update helper: ' + errorMessage);
        }
      });
    } else {
      // In add mode, go to review page
      this.router.navigate(['/add-helper/helper/review']);
    }
  }

  goToForm() {
    // Navigate based on edit mode
    if (this.helperDetailsService.getEditMode()) {
      this.router.navigate(['/edit-helper/form']);
    } else {
      this.router.navigate(['/add-helper/helper/form']);
    }
  }

  // Document upload methods
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      if (this.validateFile(file)) {
        this.docment = file;
        console.log('Selected document:', this.docment);
      }
    } else {
      console.error('No file selected');
    }
  }

  getFileName(): string {
    return this.docment ? this.docment.name : '';
  }

  removeFile() {
    this.docment = null;
    console.log('Document removed');
  }

  // File validation
  private validateFile(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid file format (PDF, JPG, JPEG, PNG)');
      return false;
    }
    
    return true;
  }
}
