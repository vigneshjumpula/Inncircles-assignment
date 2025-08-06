import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HelperDetailsService } from '../../services/helper-details.service'; 

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, MatIconModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
    userForm: FormGroup;
    formSubmitted = false;

    constructor(private router: Router, private formBuilder: FormBuilder, private helperDetailsService: HelperDetailsService) {
        this.userForm = this.formBuilder.group({
           upload_photo: ['', Validators.required],
           type_of_service: ['', Validators.required],
           organization_name: ['', Validators.required],
           full_name: ['', [Validators.required, Validators.minLength(2)]],
           languages: ['', Validators.required],
           gender: ['', Validators.required],
           phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
           email: ['', [Validators.required, Validators.email]],
           choose_vehicle: ['', Validators.required],
           kyc: ['', Validators.required]
        });
    }

    // Get form control for easy access in template
    get f() { return this.userForm.controls; }

    submitForm() {
        console.log(this.userForm+"abc");
        this.formSubmitted = true;
        if (this.userForm.valid) {
            console.log('Form is valid! Navigating to document page...');
            console.log('Form data:', this.userForm.value);
            this.helperDetailsService.setHelperDetails(this.userForm.value);
            this.router.navigate(['/add-helper/helper/document']);
        } else {
            console.log('Form is invalid! Please check the errors.');
            
            // Mark all fields as touched to show validation errors
            this.markFormGroupTouched(this.userForm);
            
            // Scroll to first error
            this.scrollToFirstError();
        }
    }

    private markFormGroupTouched(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            control?.markAsTouched({ onlySelf: true });
        });
    }

    // Helper method to scroll to first error
    private scrollToFirstError() {
        const firstErrorElement = document.querySelector('.error-message');
        if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Helper method to check if field has error
    hasError(fieldName: string): boolean {
        const field = this.userForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched || this.formSubmitted));
    }

    // Helper method to get error message for a field
    getErrorMessage(fieldName: string): string {
        const field = this.userForm.get(fieldName);
        if (field?.errors && this.hasError(fieldName)) {
            if (field.errors['required']) {
                return `${this.getFieldDisplayName(fieldName)} is required`;
            }
            if (field.errors['email']) {
                return 'Please enter a valid email address';
            }
            if (field.errors['pattern']) {
                if (fieldName === 'phone_number') {
                    return 'Please enter a valid 10-digit phone number';
                }
            }
            if (field.errors['minlength']) {
                return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
            }
        }
        return '';
    }

    // Helper method to get user-friendly field names
    private getFieldDisplayName(fieldName: string): string {
        const fieldNames: { [key: string]: string } = {
            'upload_photo': 'Photo',
            'type_of_service': 'Type of Service',
            'organization_name': 'Organization Name',
            'full_name': 'Full Name',
            'languages': 'Languages',
            'gender': 'Gender',
            'phone_number': 'Phone Number',
            'email': 'Email',
            'choose_vehicle': 'Vehicle',
            'kyc': 'KYC Document'
        };
        return fieldNames[fieldName] || fieldName;
    }
}

