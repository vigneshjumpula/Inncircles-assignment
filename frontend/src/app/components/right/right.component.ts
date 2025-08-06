import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import {HelperDetailsService} from '../../services/helper-details.service';
import { HttpParams } from '@angular/common/http';
import { KeyValuePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right',
  standalone: true,
  imports: [RouterOutlet, KeyValuePipe , CommonModule],
  templateUrl: './right.component.html',
  styleUrl: './right.component.scss'
})
export class RightComponent implements OnInit {
  helper: any = null;
  constructor(
    private route: ActivatedRoute,
    private helperDetailService: HelperDetailsService
  ) {}

  ngOnInit() {
    // React to param changes so clicking different IDs reloads
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('ID from route:', id);
      if (id) {
        this.helper = this.helperDetailService.getHelperById(id);
        console.log('Helper details:', this.helper);
      } else {
        console.error('No ID found in route');
      }
    });
  }

  // Generate initials from full name
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
}
