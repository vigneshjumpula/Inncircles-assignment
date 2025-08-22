import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

export interface DeleteDialogData {
  helperName: string;
  helperRole: string;
}

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CommonModule],
  template: `
    <div class="delete-dialog">
      <div class="dialog-header">
        <div class="">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#d13e20ff"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg>
        </div>
        <button mat-icon-button class="close-btn" (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      
      <div class="dialog-content">
        <h2 class="dialog-title">Delete <span style="color: #d13e20ff;">{{data.helperName}} ({{ data.helperRole }})</span></h2>
        <p class="dialog-message">You can't undo this action.</p>
        <hr  style="border: 0.5px solid #eee; margin: 20px 0 10px 0;" />
      </div>
      <div class="dialog-actions">
        <button mat-button class="cancel-btn" (click)="onCancel()">Cancel</button>
        <button class="delete-btn" (click)="onConfirm()" style="color: white;">
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px" fill="#fdfdfdff"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
          <p style="margin-bottom: 0; margin-top: 3px;">Delete</p>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .delete-dialog {
      padding: 24px;
      width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-top: 10px;
    }

    .warning-icon {
      width: 48px;
      height: 48px;
      background-color: #fff3cd;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #ffc107;
    }

    .warning-triangle {
      color: #856404;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .close-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      color: #666;
    }

    .dialog-content {
      margin-bottom: 16px;
    }

    .dialog-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0 0 0px 0;
      line-height: 1.4;
    }

    .dialog-message {
      font-size: 12px;
      color: #666;
      margin: 0;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .cancel-btn {
      background-color: #f8f9fa;
      color: #333;
      border: 1px solid #ddd;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
    }

    .cancel-btn:hover {
      background-color: #e9ecef;
    }

    .delete-btn {
      background-color: #ec3c3cff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .delete-btn img {
      width: 18px;
      height: 18px;
    }
  `]
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
