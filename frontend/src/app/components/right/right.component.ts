import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router } from '@angular/router';
import {HelperDetailsService} from '../../services/helper-details.service';
import { HttpParams } from '@angular/common/http';
import { KeyValuePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { QrDialogComponent } from './qr-dialog.component';
import { error } from 'console';
@Component({
  selector: 'app-right',
  standalone: true,
  imports: [RouterOutlet, KeyValuePipe , CommonModule, MatIconModule] ,
  templateUrl: './right.component.html',
  styleUrl: './right.component.scss'
})
export class RightComponent implements OnInit {
  helper: any = null;
  constructor(
    private route: ActivatedRoute,
    private helperDetailService: HelperDetailsService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  openQrDialog() {
    if (!this.helper) return;
    // Generate QR code URL with more details
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

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('Right component - ID from route:', id);
      
      if (id) {
        this.helper = this.helperDetailService.getHelperById(id);
        console.log('Right component - Helper found:', this.helper);
        if (!this.helper) {
          console.log('Helper not found in cache, attempting to reload helpers...');
          this.helperDetailService.loadHelpers().subscribe(
            helpers => {
              console.log('Helpers reloaded, trying to find helper again...');
              this.helper = this.helperDetailService.getHelperById(id);
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

  getInitials(fullName: string): string {
    if (!fullName) return '';
    return fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  // Generate a consistent color for avatar based on name
  getAvatarColor(fullName: string): string {
    if (!fullName) return '#cccccc';
    
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
      '#6C5CE7', '#A29BFE', '#FD79A8', '#E17055', '#00B894'
    ];
    
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  // Format date to readable format
  formatDate(date: any): string {
    if (!date) return '-';
    
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

  // Format languages for display
  getLanguagesDisplay(): string {
    if (!this.helper?.languages) return '-';
    if (typeof this.helper.languages === 'string') {
      // Handle comma-separated string (with or without spaces)
      return this.helper.languages.split(',').map((lang: string) => lang.trim()).join(', ');
    }
    // Handle array format
    return Array.isArray(this.helper.languages) ? 
      this.helper.languages.join(', ') : 
      this.helper.languages;
  }

  onDeleteClick() {
    if (this.helper && this.helper._id) {
      const id = this.helper._id;
      const helperName = this.helper.full_name;
      
      
      if (confirm(`Are you sure you want to delete ${helperName}?`)) {
        console.log('Deleting helper with ID:', id);
        
        this.helperDetailService.deleteHelper(id).subscribe({
          next: () => {
            this.router.navigate(['/main']);
            this.helperDetailService.refreshHelpers().subscribe();
          },
          error: (error) => {
            alert('Failed to delete helper: ' + error.message);
          }
        });
      }
    } else {
      console.error('No helper selected for deletion');
    }
  }

  onEditClick() {
    if (this.helper && this.helper._id) {
      const id = this.helper._id;
      console.log('Editing helper with ID:', id);
      
      // Set edit mode with helper ID
      this.helperDetailService.setEditMode(true, id);
      
      // Clear any cached helper details since form will fetch fresh data by ID
      this.helperDetailService.setHelperDetails(null);
      this.helperDetailService.setDocument(null); // Clear document for edit
      
      // Navigate to edit form with the helper ID
      this.router.navigate(['/edit-helper/form'], { queryParams: { id } });
    } else {
      console.error('No helper selected for editing');
    }
  }
}
