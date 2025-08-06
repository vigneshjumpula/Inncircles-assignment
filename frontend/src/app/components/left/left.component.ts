import { Component, OnInit } from '@angular/core';
import { HelperDetailsService } from '../../services/helper-details.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-left',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './left.component.html',
  styleUrl: './left.component.scss'
})

export class LeftComponent implements OnInit {
  constructor(private helperDetailsService: HelperDetailsService, private router: Router) {}
  helpers: any[] = [];
  selectedHelper: any = null;
  
  ngOnInit() {
    this.helperDetailsService.loadHelpers().subscribe(
      data => {
        this.helpers = data;
        console.log('Helpers fetched in LeftComponent:', this.helpers);
      },
      error => console.error('Error fetching helpers in LeftComponent:', error)
    );
  }
  
  onHelperClick(helper: any) {
    this.selectedHelper = helper;
    const helperId = helper?._id;
    console.log('Clicked helper id:', helperId);
    this.router.navigate(['main/helpers', helperId]);
  }

  getInitials(fullName: string): string {
    if (!fullName) return 'NA';
    const names = fullName.split(' ');
    const initials = names.map(name => name.charAt(0).toUpperCase()).join('');
    return initials.substring(0, 2);
  }

  getAvatarColor(index: number): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
    ];
    return colors[index % colors.length];
  }

  getJoinedDuration(joinedDate: any): string {
    if (!joinedDate) return '';
    const now = new Date();
    const joined = new Date(joinedDate);
    const diffInDays = Math.floor((now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 30) {
      return `${diffInDays} days`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `${years} year${years > 1 ? 's' : ''}`;
    }
  }
}
