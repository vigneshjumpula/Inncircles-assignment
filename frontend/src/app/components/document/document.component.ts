import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HelperDetailsService } from '../../services/helper-details.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-document',
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule],
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent {

  constructor(private router: Router, private helperDetailsService: HelperDetailsService) {}

  submitDocument() {
    this.helperDetailsService.setDocument(this.docment);
    this.router.navigate(['/add-helper/helper/review']);
  }
  goToForm() {
    this.router.navigate(['/add-helper/helper/form']);
  }

  docment?:any;
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.docment = file;
      console.log('Selected document:', this.docment);
    } else {
      console.error('No file selected');
    }
  }
}
