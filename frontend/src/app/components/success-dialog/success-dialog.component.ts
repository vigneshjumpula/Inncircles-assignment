import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface SuccessDialogData {
  title: string;
  message: string;
  actionButtonText?: string;
}

@Component({
  selector: 'app-success-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="success-dialog">
      <div class="success-icon">
        <mat-icon class="checkmark-icon">check_circle</mat-icon>
      </div>
      <h2 class="dialog-title">{{ data.title }}</h2>
      <p class="dialog-message">{{ data.message }}</p>
      <div class="dialog-actions">
        <button mat-flat-button color="primary" (click)="onClose()" class="action-button">
          {{ data.actionButtonText || 'OK' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .success-dialog {
      text-align: center;
      padding: 24px;
      max-width: 400px;
    }

    .success-icon {
      margin-bottom: 16px;
    }

    .checkmark-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #4caf50;
      background: #e8f5e8;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .dialog-title {
      font-size: 24px;
      font-weight: 600;
      margin: 16px 0 8px 0;
      color: #333;
    }

    .dialog-message {
      font-size: 16px;
      color: #666;
      margin-bottom: 24px;
      line-height: 1.4;
    }

    .dialog-actions {
      display: flex;
      justify-content: center;
    }

    .action-button {
      min-width: 120px;
      height: 40px;
      border-radius: 20px;
      font-weight: 500;
    }
  `]
})
export class SuccessDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccessDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SuccessDialogData
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
