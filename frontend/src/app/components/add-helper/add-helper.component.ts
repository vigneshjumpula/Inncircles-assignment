import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { SteppersComponent } from '../steppers/steppers.component';
import { HelperDetailsService } from '../../services/helper-details.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-add-helper',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SteppersComponent, NgIf],
  templateUrl: './add-helper.component.html',
  styleUrls: ['./add-helper.component.scss']
})
export class AddHelperComponent {
  isEditMode: boolean | null = false;

  constructor(private router: Router, private helperDetailsService: HelperDetailsService) {
    this.isEditMode = this.helperDetailsService.getEditMode();
    console.log('Edit mode:', this.isEditMode);
    
    // Reset step completion when starting a new helper addition (not in edit mode)
    if (!this.isEditMode) {
      this.helperDetailsService.resetStepCompletion();
    }
  }

  backToHelper(): void {
    this.router.navigate(['/main']);
  }
}
