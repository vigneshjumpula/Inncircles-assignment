import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HelperDetailsService } from '../../services/helper-details.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent {
    constructor(private router: Router, private helperDetailsService: HelperDetailsService) {}
    formDetails?:any;
    documentDetails?: any;
    ngOnInit(){
      this.formDetails = this.helperDetailsService.getHelperDetails();
      this.documentDetails = this.helperDetailsService.getDocument();
      console.log('Form Details:', this.formDetails);
      console.log('Document Details:', this.documentDetails);
    }
    submitReview() {
      this.helperDetailsService.addHelper().subscribe({
        next: (response) => {
          console.log('Helper added successfully:', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Error adding helper:', error);
        }
      });
    }
    goToDocument() {
      this.router.navigate(['/add-helper/helper/document']);
    }
}
