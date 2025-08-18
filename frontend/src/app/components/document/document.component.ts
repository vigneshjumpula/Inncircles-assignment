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
  document: File | null = null;

  constructor(private router: Router, private helperDetailsService: HelperDetailsService) {}

  submitDocument() {
    this.helperDetailsService.setDocument(this.document);
    console.log('Document submitted:', this.document ? 'Document uploaded' : 'No document uploaded');
    

    if (this.helperDetailsService.getEditMode()) {
      this.helperDetailsService.addHelper().subscribe({
        next: (response) => {
          console.log('Helper updated successfully:', response);
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
      this.router.navigate(['/add-helper/helper/review']);
    }
  }

  goToForm() {
    if (this.helperDetailsService.getEditMode()) {
      this.helperDetailsService.setDocument(this.document);
      this.router.navigate(['/edit-helper/form']);
    } else {
      this.helperDetailsService.setDocument(this.document);
      this.router.navigate(['/add-helper/helper/form']);
    }
  }


  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    const file: File | null = target.files && target.files.length > 0 ? target.files[0] : null;
    if (file) {
      if (this.validateFile(file)) {
        this.document = file;
        console.log('Selected document:', this.document);
      }
    } else {
      console.error('No file selected');
    }
  }

  getFileName(): string {
    return this.document ? this.document.name : '';
  }

  removeFile() {
    this.document = null;
    console.log('Document removed');
  }


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
