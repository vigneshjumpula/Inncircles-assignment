import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qr-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Identification Card</h2>
    <div mat-dialog-content>
      <p><strong>Employee ID:</strong> {{ data.helper.employee_code }}</p>
      <p><strong>Name:</strong> {{ data.helper.full_name }}</p>
      <p><strong>Service:</strong> {{ data.helper.type_of_service }}</p>
      <p><strong>Organization:</strong> {{ data.helper.organization_name }}</p>
      <p><strong>Phone:</strong> {{ data.helper.phone_number }}</p>
      <div style="text-align:center; margin-top:16px;">
        <img [src]="data.qrCodeUrl" alt="QR Code" style="width:160px; height:160px;" />
        <p style="font-size:12px; color:#888;">Scan QR for details</p>
      </div>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="dialogRef.close()">Close</button>
    </div>
  `,
  styleUrls: []
})
export class QrDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<QrDialogComponent>
  ) {}
}
