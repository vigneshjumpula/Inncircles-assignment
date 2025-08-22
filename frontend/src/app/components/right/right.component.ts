import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import {HelperDetailsService} from '../../services/helper-details.service';
import { HttpParams } from '@angular/common/http';
import { KeyValuePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Helper } from '../../models/helper.interface';

import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QrDialogComponent } from './qr-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog.component';
import { error } from 'console';
@Component({
  selector: 'app-right',
  standalone: true,
  imports: [RouterOutlet, KeyValuePipe , CommonModule, MatIconModule] ,
  templateUrl: './right.component.html',
  styleUrl: './right.component.scss'
})
export class RightComponent implements OnInit {
  helper: Helper | null = null;
  constructor(
    private route: ActivatedRoute,
    private helperDetailService: HelperDetailsService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('Right component - ID from route:', id);
      
      if (id) {
        this.helper = this.helperDetailService.getHelperById(id) || null;
        console.log('Right component - Helper found:', this.helper);
        if (!this.helper) {
          console.log('Helper not found in cache, attempting to reload helpers...');
          this.helperDetailService.loadHelpers().subscribe(
            helpers => {
              console.log('Helpers reloaded, trying to find helper again...');
              this.helper = this.helperDetailService.getHelperById(id) || null;
              if (this.helper) {
                console.log('Helper found after reload:', this.helper);
              } else {
                console.error('Helper still not found after reload. ID:', id);
              }
            },
            error => {
              console.error('Error reloading helpers:', error);
            }
          );
        }
      } else {
        console.error('No ID found in route parameters');
        this.helper = null;
      }
    });
  }
  
  openQrDialog() {
    if (!this.helper) return;
    const qrData = JSON.stringify({
      id: this.helper._id,
      name: this.helper.full_name,
      organization: this.helper.organization_name,
      service: this.helper.type_of_service,
      phone: this.helper.phone_number
    });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrData)}`;
    this.dialog.open(QrDialogComponent, {
      data: {
        helper: this.helper,
        qrCodeUrl
      },
      width: '350px'
    });
  }

  getImgUrl(helper: Helper){
    if(helper.profile!== null && helper.profile !== undefined && helper.profile !== '') {
      return `http://localhost:3000/uploads/${helper.profile}`;
    }
    return 'https://avatar.iran.liara.run/public/93';
  }


  formatDate(date: Date): string { 
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) return '-';
      
      return parsedDate.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return '-';
    }
  }

  
  getLanguagesDisplay(): string {
    if (!this.helper?.languages) return '-';
    if (typeof this.helper.languages === 'string') {
      return this.helper.languages.split(',').map((lang: string) => lang.trim()).join(', ');
    }
   
    return Array.isArray(this.helper.languages) ? 
      this.helper.languages.join(', ') : 
      this.helper.languages;
  }

  openKycDocument() {
    if (this.helper && this.helper._id) {
      let kycDocument = this.helper.kyc;
      console.log('KYC document value:', kycDocument);
      if (kycDocument) {
      
        if (kycDocument instanceof File) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            const fileUrl = e.target.result;
            window.open(fileUrl, '_blank');
          };
          reader.readAsDataURL(kycDocument);
        } else if (typeof kycDocument === 'string' && kycDocument.trim() !== '') {
          
          let fileUrl = '';
          if (kycDocument.startsWith('http')) {
            fileUrl = kycDocument;
          } else {
            fileUrl = `http://localhost:3000/uploads/${kycDocument}`;
          }
          window.open(fileUrl, '_blank');
        } else {
          alert('KYC document is not available.');
        }
      } else {
        alert('KYC document is not available.');
      }
    } else {
      console.error('No helper selected for KYC process');
    }
  }

  onDeleteClick() {
    if (this.helper && this.helper._id) {
      const id = this.helper._id;
      const helperName = this.helper.full_name;
      const helperRole = this.helper.type_of_service;
      
      // Open delete confirmation dialog
      const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
        data: {
          helperName: helperName,
          helperRole: helperRole
        },
        width: '450px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          console.log('Deleting helper with ID:', id);
          
          this.helperDetailService.deleteHelper(id).subscribe({
            next: () => {
              // Show success snackbar with helper's name
              this.snackBar.open(`${helperName} deleted!`, 'Close', {
                duration: 4000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
                panelClass: ['success-snackbar']
              });
              
              this.router.navigate(['/main']);
              this.helperDetailService.refreshHelpers().subscribe();
            },
            error: (error) => {
              // Show error snackbar instead of alert
              this.snackBar.open('Failed to delete helper: ' + error.message, 'Close', {
                duration: 4000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
                panelClass: ['error-snackbar']
              });
            }
          });
        }
      });
    } else {
      console.error('No helper selected for deletion');
    }
  }

  onEditClick() {
    if (this.helper && this.helper._id) {
      const id = this.helper._id;
      console.log('Editing helper with ID:', id);
      this.helperDetailService.setEditMode(true, id);
      this.helperDetailService.setHelperDetails(null);
      this.helperDetailService.setDocument(null); 
      this.router.navigate(['/edit-helper/form'], { queryParams: { id } });
    } else {
      console.error('No helper selected for editing');
    }
  }
}
