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
  helpers = computed(() => this.helperDetailsService.getFilter());
  selectedHelperId: string | null = null;

  constructor(
    private helperDetailsService: HelperDetailsService,
    private router: Router
  ) {}
  
  
    // No manual loading needed; computed signal updates automatically
    ngOnInit(): void {
  const helpers = this.helpers();
  if (helpers && helpers.length > 0) {
    this.selectedHelperId = helpers[0]._id;
    this.router.navigate(['/main/helpers', helpers[0]._id]);
  }

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

    
  getImgUrl(helper: any){
    if(helper.profile!== null && helper.profile !== undefined && helper.profile !== '') {
      return `http://localhost:3000/uploads/${helper.profile}`;
    }
    return 'https://avatar.iran.liara.run/public/93';
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
