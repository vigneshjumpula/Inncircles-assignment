import { Component, OnInit, computed } from '@angular/core';
import { HelperDetailsService } from '../../services/helper-details.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Helper } from '../../models/helper.interface';

@Component({
  selector: 'app-left',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})

export class LeftComponent{
  helpers = computed(() => this.helperDetailsService.getFilter());
  selectedHelperId: string | null = null;

  constructor(
    private helperDetailsService: HelperDetailsService,
    private router: Router
  ) {}
  
  
 
    ngOnInit(): void {
    const helpers = this.helpers();
    if (helpers && helpers.length > 0 && helpers[0]._id) {
      this.selectedHelperId = helpers[0]._id;
      this.router.navigate(['/main/helpers', helpers[0]._id]);
    }

  }

 
  onHelperClick(helper: Helper): void {
    if (helper._id) {
      this.selectedHelperId = helper._id;
      this.router.navigate(['/main/helpers', helper._id]);
    }
  }

  isHelperSelected(helper: Helper): boolean {
    return this.selectedHelperId === helper._id;
  }

    
  getImgUrl(helper: Helper){
    if(helper.profile!== null && helper.profile !== undefined && helper.profile !== '') {
      return `http://localhost:3000/uploads/${helper.profile}`;
    }
    return 'https://avatar.iran.liara.run/public/93';
  }

 
  getJoinedDuration(joinedDate: Date | string): string {
   
    
    const date = new Date(joinedDate);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  }
}
