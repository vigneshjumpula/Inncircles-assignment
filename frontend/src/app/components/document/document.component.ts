import { Component, OnInit } from '@angular/core';
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
export class DocumentComponent implements OnInit {
  document: File | null = null;
  isEditMode = false;
  documentUrl: string | null = null;

  constructor(private router: Router, private helperDetailsService: HelperDetailsService) {}

  ngOnInit() {
    this.isEditMode = this.helperDetailsService.getEditMode();
    
    if (this.isEditMode) {
      // In edit mode, get document from helper data
      const helperId = this.helperDetailsService.getEditingHelperId();
      if (helperId) {
        const helperData = this.helperDetailsService.getHelperById(helperId);
        if (helperData && helperData.document) {
          this.loadDocumentFromBackend(helperData.document);
        }
      }
    } else {
      // In add mode, get document from cached service
      const cachedDocument = this.helperDetailsService.getDocument();
      if (cachedDocument) {
        this.document = cachedDocument;
        this.loadDocumentPreview(cachedDocument);
      }
    }
  }

  private loadDocumentFromBackend(documentData: string | File) {
    if (typeof documentData === 'string') {
      const documentUrl = documentData.startsWith('http')
        ? documentData
        : `http://localhost:3000/uploads/${documentData}`;
      
      if (this.isImageFile(documentData)) {
        this.documentUrl = documentUrl;
      }
      
      const file = new File([], documentData, {
        type: this.isImageFile(documentData) ? 'image/jpeg' : 'application/pdf'
      });
      this.document = file;
    } else if (documentData instanceof File) {
      this.document = documentData;
      this.loadDocumentPreview(documentData);
    }
  }

  private loadDocumentPreview(file: File) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.documentUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  private isImageFile(fileName: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const fileNameLower = fileName.toLowerCase();
    return imageExtensions.some(ext => fileNameLower.endsWith(ext));
  }

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
        // Use FileReader for image preview
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.documentUrl = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        } else {
          this.documentUrl = null;
        }
      }
    } else {
      console.error('No file selected');
    }
  }

  getFileName(): string {
    if (this.document) {
      if (this.document.name && this.document.name !== '') {
        return this.document.name;
      }
      // For files loaded from backend, extract filename from the original data
      if (this.isEditMode) {
        const helperId = this.helperDetailsService.getEditingHelperId();
        if (helperId) {
          const helperData = this.helperDetailsService.getHelperById(helperId);
          if (helperData && helperData.document && typeof helperData.document === 'string') {
            return helperData.document.split('/').pop() || helperData.document;
          }
        }
      }
    }
    return '';
  }

  removeFile() {
    this.document = null;
    this.documentUrl = null;
    console.log('Document removed');
  }


  private validateFile(file: File): boolean {
    const maxSize = 5 * 1024 * 1024; 
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
