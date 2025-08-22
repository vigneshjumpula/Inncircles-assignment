import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

export interface KycUploadDialogData {
  existingDocument?: File | string;
  existingDocumentType?: string;
}

export interface KycUploadResult {
  file: File;
  documentType: string;
}

@Component({
  selector: 'app-kyc-upload-dialog',
  standalone: true,
  imports: [
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSelectModule, 
    MatFormFieldModule,
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="kyc-upload-dialog">
      <div class="dialog-header">
        <h2 class="dialog-title">Upload KYC Documents</h2>
        <button mat-icon-button class="close-btn" (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div class="dialog-content">
        <div class="form-section">
          <label class="section-label">Select Document Type</label>
          <mat-form-field appearance="outline" class="document-type-field">
            <mat-select [formControl]="documentTypeControl" placeholder="Document Type">
              <mat-option value="aadhaar">Aadhaar Card</mat-option>
              <mat-option value="pan">PAN Card</mat-option>
              <mat-option value="passport">Passport</mat-option>
              <mat-option value="driving_license">Driving License</mat-option>
              <mat-option value="voter_id">Voter ID</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="upload-section">
          <p class="upload-instruction">Please ensure both sides of the document are uploaded.</p>
          
          <div class="upload-area" 
               (click)="triggerFileInput()"
               (dragover)="onDragOver($event)"
               (dragleave)="onDragLeave($event)"
               (drop)="onDrop($event)"
               [class.drag-over]="isDragOver">
            <input #fileInput 
                   type="file" 
                   style="display: none"
                   accept=".pdf"
                   (change)="onFileSelected($event)">
            
            <div class="upload-content" *ngIf="!selectedFile">
              <div class="upload-icon">
                <mat-icon>cloud_upload</mat-icon>
              </div>
              <p class="upload-text">
                <span class="click-text">Click to upload</span> or drag and drop
              </p>
            </div>

            <div class="file-preview" *ngIf="selectedFile">
              <div class="file-info">
                <mat-icon class="file-icon">description</mat-icon>
                <span class="file-name">{{ selectedFile.name }}</span>
                <button type="button" class="remove-file-btn" (click)="removeFile($event)">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="dialog-actions">
        <button mat-button class="cancel-btn" (click)="onCancel()">Cancel</button>
        <button mat-raised-button 
                class="save-btn" 
                (click)="onSave()"
                [disabled]="!canSave()">
          Save
        </button>
      </div>
    </div>
  `,
  styles: [`
    .kyc-upload-dialog {
      width: 500px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 24px 0 24px;
      margin-bottom: 24px;
    }

    .dialog-title {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .close-btn {
      color: #666;
    }

    .dialog-content {
      padding: 0 24px;
    }

    .form-section {
      margin-bottom: 24px;
    }

    .section-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #666;
      margin-bottom: 8px;
    }

    .document-type-field {
      width: 100%;
    }

    .upload-section {
      margin-bottom: 32px;
      background-color: #fafafa;
    }

    .upload-instruction {
      font-size: 14px;
      color: #666;
      margin-bottom: 16px;
    }

    .upload-area {
      border: 2px dashed #c5b3f7;
      border-radius: 8px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background-color: #f3f0ff;
      min-height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .upload-area:hover {
      border-color: #a78bfa;
      background-color: #ede9fe;
    }

    .upload-area.drag-over {
      border-color: #8b5cf6;
      background-color: #e9e5ff;
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .upload-icon {
      margin-bottom: 12px;
    }

    .upload-icon mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #8b5cf6;
    }

    .upload-text {
      color: #6b7280;
      margin: 0;
      font-size: 14px;
    }

    .click-text {
      color: #8b5cf6;
      text-decoration: underline;
      font-weight: 500;
    }

    .file-preview {
      width: 100%;
    }

    .file-info {
      display: flex;
      align-items: center;
      background-color: #f0f0f0;
      padding: 12px 16px;
      border-radius: 6px;
      gap: 8px;
    }

    .file-icon {
      color: #666;
    }

    .file-name {
      flex: 1;
      font-size: 14px;
      color: #333;
    }

    .remove-file-btn {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .remove-file-btn:hover {
      background-color: #ddd;
    }

    .remove-file-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #666;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 24px;
      border-top: 1px solid #eee;
      margin-top: 24px;
    }

    .cancel-btn {
      color: #666;
      border: 1px solid #ddd;
      padding: 8px 16px;
    }

    .save-btn {
      background-color: #4f46e5;
      color: white;
      padding: 8px 24px;
    }

    .save-btn:disabled {
      background-color: #ccc;
      color: #999;
    }
  `]
})
export class KycUploadDialogComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  documentTypeControl = new FormControl('', Validators.required);
  selectedFile: File | null = null;
  isDragOver = false;

  constructor(
    public dialogRef: MatDialogRef<KycUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: KycUploadDialogData
  ) {
    if (data?.existingDocumentType) {
      this.documentTypeControl.setValue(data.existingDocumentType);
    }
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
      } else {
        alert('Please select a PDF file only.');
        input.value = ''; 
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
      } else {
        alert('Please select a PDF file only. Other formats are not supported.');
      }
    }
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
  }

  canSave(): boolean {
    return this.documentTypeControl.valid && this.selectedFile !== null;
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onSave(): void {
    if (this.canSave()) {
      const result: KycUploadResult = {
        file: this.selectedFile!,
        documentType: this.documentTypeControl.value!
      };
      this.dialogRef.close(result);
    }
  }
}
