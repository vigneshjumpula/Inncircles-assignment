import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
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

export class FormComponent implements OnInit {
    userForm: FormGroup;
    formSubmitted = false;
    isLanguagesDropdownOpen = false;
    selectedLanguages: string[] = [];
    selectedKycFile: File | null = null;

    constructor(
        private router: Router, 
        private formBuilder: FormBuilder, 
        private helperDetailsService: HelperDetailsService,
        private route: ActivatedRoute
    ) {
        this.userForm = this.formBuilder.group({
           type_of_service: ['', Validators.required],
           organization_name: ['', Validators.required],
           full_name: ['', [Validators.required, Validators.minLength(2)]],
           languages: ['', Validators.required],
           gender: ['', Validators.required],
           phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
           email: ['', [Validators.required, Validators.email]],
           choose_vehicle: ['', Validators.required],
           kyc: ['']
        });
    }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const helperId = params['id'];
            
            if (helperId && this.helperDetailsService.getEditMode()) {
                this.loadHelperForEdit(helperId);
            } else {
                const cachedDetails = this.helperDetailsService.getHelperDetails();
                if (cachedDetails) {
                    this.loadHelperData(cachedDetails);
                }
            }
        });
    }

    private loadHelperForEdit(helperId: string): void {
        if (this.helperDetailsService.getEditingHelperId() !== helperId) {
            this.helperDetailsService.setEditMode(true, helperId);
        }
        
        let helperDetails = this.helperDetailsService.getHelperById(helperId);
        
        if (helperDetails) {
            this.loadHelperData(helperDetails);
        } else {
            this.helperDetailsService.loadHelpers().subscribe({
                next: () => {
                    helperDetails = this.helperDetailsService.getHelperById(helperId);
                    if (helperDetails) {
                        this.loadHelperData(helperDetails);
                    }
                }
            });
        }
    }

    private loadHelperData(helperDetails: any): void {
        this.userForm.patchValue({
            type_of_service: helperDetails.type_of_service || '',
            organization_name: helperDetails.organization_name || '',
            full_name: helperDetails.full_name || '',
            gender: helperDetails.gender || '',
            phone_number: helperDetails.phone_number || '',
            email: helperDetails.email || '',
            choose_vehicle: helperDetails.choose_vehicle || ''
        });

        if (helperDetails.languages) {
            if (typeof helperDetails.languages === 'string') {
                this.selectedLanguages = helperDetails.languages.split(',').map((lang: string) => lang.trim());
            } else if (Array.isArray(helperDetails.languages)) {
                this.selectedLanguages = [...helperDetails.languages];
            }
            this.userForm.get('languages')?.setValue(this.selectedLanguages.join(', '));
        }
    }

    // Avatar methods
    getAvatarLetter(): string {
        const fullName = this.userForm.get('full_name')?.value;
        return fullName ? fullName.charAt(0).toUpperCase() : '?';
    }

    getAvatarColor(): string {
        const colors = ['#4B5FF2', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
        const fullName = this.userForm.get('full_name')?.value || '';
        const index = fullName.length % colors.length;
        return colors[index];
    }

    // onKycSelected(event: any) {
    //     const file: File = event.target.files[0];
    //     if (file) {
    //         if (this.validateFile(file)) {
    //             this.selectedKycFile = file;
    //             this.convertFileToBase64(file).then(base64 => {
    //                 this.userForm.patchValue({ kyc: base64 });
    //             });
    //         }
    //     }
    // }

    // private convertFileToBase64(file: File): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => resolve(reader.result as string);
    //         reader.onerror = error => reject(error);
    //     });
    // }

    // private validateFile(file: File): boolean {
    //     const maxSize = 1 * 1024 * 1024; // 1MB
    //     if (file.size > maxSize) {
    //         alert('File size must be less than 1MB');
    //         return false;
    //     }
    //     return true;
    // }

    get f() { return this.userForm.controls; }

    submitForm() {
        this.formSubmitted = true;
        if (this.userForm.valid) {
            this.helperDetailsService.setHelperDetails(this.userForm.value);
            
            if (this.helperDetailsService.getEditMode()) {
                this.router.navigate(['/edit-helper/document']);
            } else {
                this.router.navigate(['/add-helper/helper/document']);
            }
        } else {
            this.markFormGroupTouched(this.userForm);
            this.scrollToFirstError();
        }
    }

    // removeKyc() {
    //     this.selectedKycFile = null;
    //     this.userForm.patchValue({ kyc: '' });
    // }

    // getKycFileName(): string {
    //     return this.selectedKycFile ? this.selectedKycFile.name : '';
    // }

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

    
    toggleLanguagesDropdown() {
        this.isLanguagesDropdownOpen = !this.isLanguagesDropdownOpen;
    }

    toggleLanguage(language: string) {
        const index = this.selectedLanguages.indexOf(language);
        if (index > -1) {
            this.selectedLanguages.splice(index, 1);
        } else {
            this.selectedLanguages.push(language);
        }
        
        // Update form control with proper spacing
        this.userForm.patchValue({
            languages: this.selectedLanguages.join(', ')
        });
    }

    isLanguageSelected(language: string): boolean {
        return this.selectedLanguages.includes(language);
    }

    getSelectedLanguagesText(): string {
        if (this.selectedLanguages.length === 0) {
            return 'Select languages';
        }
        if (this.selectedLanguages.length === 1) {
            return this.selectedLanguages[0].charAt(0).toUpperCase() + this.selectedLanguages[0].slice(1);
        }
        return `${this.selectedLanguages.length} languages selected`;
    }
}

