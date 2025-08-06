import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { HelperDetailsService } from '../../services/helper-details.service';
import { HttpParams } from '@angular/common/http';
import { KeyValuePipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right',
  standalone: true,
  imports: [RouterOutlet, KeyValuePipe, CommonModule],
  templateUrl: './right.component.html',
  styleUrl: './right.component.scss'
})
export class RightComponent implements OnInit {
  // Generate a consistent color for avatar backgrounds based on the name
  getAvatarColor(name: string): string {
    if (!name) return '#bdbdbd';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 70%)`;
    return color;
  }
  helper: any = null;
  
  constructor(
    private route: ActivatedRoute,
    private helperDetailService: HelperDetailsService
  ) {}

  ngOnInit() {
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

  getInitials(fullName: string): string {
    if (!fullName) return 'NA';
    const names = fullName.split(' ');
    const initials = names.map(name => name.charAt(0).toUpperCase()).join('');
    return initials.substring(0, 2);
  }

  formatDate(date: any): string {
    if (!date) return 'Not Available';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  }
}
