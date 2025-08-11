import { Component, OnInit, computed } from '@angular/core';
import { HelperDetailsService } from '../../services/helper-details.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-left',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent implements OnInit {
  // Computed signal that reflects the service's helpers signal
  helpers = computed(() => this.helperDetailsService.getFilter());
  selectedHelperId: string | null = null;

  constructor(
    private helperDetailsService: HelperDetailsService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // No manual loading needed; computed signal updates automatically
  }

  // Handle click event on a helper item: set selection and navigate to detail
  onHelperClick(helper: any): void {
    this.selectedHelperId = helper._id;
    this.router.navigate(['/main/helpers', helper._id]);
  }

  // Check if a helper is the currently selected one
  isHelperSelected(helper: any): boolean {
    return this.selectedHelperId === helper._id;
  }

  // Generate two-letter initials from a full name, fallback to 'NA'
  getInitials(fullName: string): string {
    if (!fullName) {
      return 'NA';
    }
    return fullName
      .split(' ')
      .map(n => n.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  }

  // Assign a deterministic background color based on index
  getAvatarColor(index: number): string {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
    ];
    return colors[index % colors.length];
  }

  // Calculate the duration since join date in days
  getJoinedDuration(joinedDate: string): string {
    const date = new Date(joinedDate);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  }
}
