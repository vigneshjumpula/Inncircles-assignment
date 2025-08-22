import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-qr-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="id-card-container">
      <div class="id-card-header">
        <h2 class="company-name">{{ data.helper.organization_name }}</h2>
        <p class="card-title">Employee ID Card</p>
      </div>
      
      <div class="profile-section">
        <div class="profile-image">
          <img [src]="getProfileImage()" alt="Profile" />
        </div>
        <div class="employee-info">
          <h3 class="employee-name">{{ data.helper.full_name | titlecase }}</h3>
          <p class="employee-id">ID: {{ data.helper.employee_code }}</p>
          <p class="service-type">{{ data.helper.type_of_service | titlecase }}</p>
        </div>
      </div>
      
      <div class="details-section">
        <div class="detail-row">
          <span class="label">Phone:</span>
          <span class="value">{{ data.helper.phone_number }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Email:</span>
          <span class="value">{{ data.helper.email }}</span>
        </div>
        <div class="detail-row">
          <span class="label">Gender:</span>
          <span class="value">{{ data.helper.gender | titlecase }}</span>
        </div>
      </div>
      
      <div class="qr-section">
        <div class="qr-code">
          <img [src]="data.qrCodeUrl" alt="QR Code" />
        </div>
        <p class="qr-text">Scan for verification</p>
      </div>
      
      <div class="dialog-actions">
        <button mat-flat-button color="primary" (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
          Close
        </button>
      </div>
    </div>
  `,
  styles: [`
    .id-card-container {
      padding: 25px;
      max-width: 100%;
      width: 100%;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      border: 1px solid #e0e0e0;
      box-sizing: border-box;
    }

    .id-card-header {
      text-align: center;
      margin-bottom: 25px;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 15px;
    }

    .company-name {
      font-size: 22px;
      font-weight: 600;
      margin: 0 0 5px 0;
      color: #1976d2;
    }

    .card-title {
      font-size: 14px;
      margin: 0;
      color: #666;
      font-weight: 400;
    }

    .profile-section {
      display: flex;
      align-items: center;
      margin-bottom: 25px;
      gap: 20px;
    }

    .profile-image img {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
      object-fit: cover;
      flex-shrink: 0;
      background-color: #f5f5f5;
      display: block;
    }

    .profile-image {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .employee-info {
      flex: 1;
      min-width: 0;
    }

    .employee-name {
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 6px 0;
      color: #333;
      word-wrap: break-word;
    }

    .employee-id {
      font-size: 14px;
      margin: 0 0 10px 0;
      color: #666;
      font-weight: 500;
    }

    .service-type {
      font-size: 12px;
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 6px;
      display: inline-block;
      margin: 0;
      font-weight: 500;
    }

    .details-section {
      margin-bottom: 25px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
      padding: 6px 0;
      border-bottom: 1px solid #f5f5f5;
      align-items: center;
    }

    .detail-row:last-child {
      margin-bottom: 0;
      border-bottom: none;
    }

    .label {
      font-weight: 500;
      color: #666;
      flex-shrink: 0;
    }

    .value {
      font-weight: 500;
      color: #333;
      text-align: right;
      word-wrap: break-word;
      margin-left: 10px;
    }

    .qr-section {
      text-align: center;
      margin-bottom: 25px;
    }

    .qr-code {
      display: inline-block;
      width: 120px;
      height: 120px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      background-color: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }

    .qr-code img {
      width: 120px;
      height: 120px;
      border-radius: 8px;
      display: block;
      object-fit: contain;
    }

    .qr-text {
      font-size: 12px;
      margin: 12px 0 0 0;
      color: #666;
      font-weight: 400;
    }

    .dialog-actions {
      text-align: center;
      border-top: 1px solid #e0e0e0;
      padding-top: 15px;
    }

    .dialog-actions button {
      min-width: 120px;
      border-radius: 6px;
      padding: 10px 20px;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .id-card-container {
        padding: 20px;
      }
      
      .profile-section {
        flex-direction: column;
        text-align: center;
        gap: 15px;
      }
      
      .employee-info {
        text-align: center;
      }
      
      .detail-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }
      
      .value {
        text-align: left;
        margin-left: 0;
      }
    }
  `]
})
export class QrDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<QrDialogComponent>
  ) {}

  getProfileImage(): string {
    // Check if profile data exists
    if (this.data.helper.profile) {
      // If it's a file path from backend
      if (typeof this.data.helper.profile === 'string') {
        // If it already starts with http, use as is
        if (this.data.helper.profile.startsWith('http')) {
          return this.data.helper.profile;
        }
        // If it's a data URL (base64), use as is
        if (this.data.helper.profile.startsWith('data:')) {
          return this.data.helper.profile;
        }
        // If it's a file path, construct URL
        return `http://localhost:3000/uploads/${this.data.helper.profile}`;
      }
    }
    
    // Return default avatar if no profile image
    return 'https://avatar.iran.liara.run/public/93';
  }
}
