import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { HelperDetailsService } from '../../services/helper-details.service'; 
import { profile } from 'console';

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
    selectedProfileFile: File | null = null;
    selectedImage: File | null = null;
    profileImageUrl: string | null = null;
    kycDocumentUrl: string | null = null;

    constructor(
        private router: Router, 
        private formBuilder: FormBuilder, 
        private helperDetailsService: HelperDetailsService,
        private route: ActivatedRoute
    ) {
        this.userForm = this.formBuilder.group({
           profile: [null,Validators.required],
           type_of_service: ['', Validators.required],
           organization_name: ['', Validators.required],
           full_name: ['', [Validators.required, Validators.minLength(2)]],
           languages: ['', Validators.required],
           gender: ['', Validators.required],
           phone_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
           email: ['', [Validators.required, Validators.email]],
           choose_vehicle: ['', Validators.required],
           kyc: [null, Validators.required],
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

        // Load profile image if exists
        if (helperDetails.profile && helperDetails.profile !== '') {
            if (typeof helperDetails.profile === 'string') {
                const isFullUrl = helperDetails.profile.startsWith('http');
                this.profileImageUrl = isFullUrl ? helperDetails.profile : `http://localhost:3000/uploads/${helperDetails.profile}`;
                this.selectedProfileFile = new File([], helperDetails.profile, { type: 'image/jpeg' });
                this.selectedImage = this.selectedProfileFile;
                this.userForm.patchValue({ profile: helperDetails.profile });
            } else if (helperDetails.profile instanceof File) {
                this.selectedProfileFile = helperDetails.profile;
                this.selectedImage = helperDetails.profile;
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.profileImageUrl = e.target?.result as string;
                };
                reader.readAsDataURL(helperDetails.profile);
                this.userForm.patchValue({ profile: helperDetails.profile });
            }
        }

        // Load KYC document if exists
        if (helperDetails.kyc && helperDetails.kyc !== '') {
            if (typeof helperDetails.kyc === 'string') {
                const isFullUrl = helperDetails.kyc.startsWith('http');
                const kycUrl = isFullUrl ? helperDetails.kyc : `http://localhost:3000/uploads/${helperDetails.kyc}`;
                this.selectedKycFile = new File([], helperDetails.kyc, { type: 'image/jpeg' });
                // Only set preview URL if it's an image
                if (this.isImageFile(helperDetails.kyc)) {
                    this.kycDocumentUrl = kycUrl;
                }
                this.userForm.patchValue({ kyc: helperDetails.kyc });
            } else if (helperDetails.kyc instanceof File) {
                // If KYC is a File object
                this.selectedKycFile = helperDetails.kyc;
                // Create preview URL for images
                if (helperDetails.kyc.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.kycDocumentUrl = e.target?.result as string;
                    };
                    reader.readAsDataURL(helperDetails.kyc);
                }
                this.userForm.patchValue({ kyc: helperDetails.kyc });
            }
        }
    }

    // private getFileNameFromUrl(url: string): string | null {
    //     try {
    //         const urlParts = url.split('/');
    //         const fileName = urlParts[urlParts.length - 1];
    //         return fileName || null;
    //     } catch {
    //         return null;
    //     }
    // }

    private isImageFile(fileName: string): boolean {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        const fileNameLower = fileName.toLowerCase();
        return imageExtensions.some(ext => fileNameLower.endsWith(ext));
    }

    get f() { return this.userForm.controls; }

    submitForm() {
        this.formSubmitted = true;
        if (this.userForm.valid) {
            // Set the profile file
            if (this.selectedImage) {
                this.userForm.patchValue({ profile: this.selectedImage });
            } else {
                this.userForm.patchValue({ profile: '' });
            }

            // Set the KYC file
            if (this.selectedKycFile) {
                this.userForm.patchValue({ kyc: this.selectedKycFile });
            } else {
                this.userForm.patchValue({ kyc: '' });
            }

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

    removeKyc() {
        this.selectedKycFile = null;
        this.kycDocumentUrl = null;
        this.userForm.patchValue({ kyc: '' });
    }

    getKycFileName(): string {
        return this.selectedKycFile ? this.selectedKycFile.name : '';
    }

    removeProfile() {
        this.selectedProfileFile = null;
        this.selectedImage = null;
        this.profileImageUrl = null;
        this.userForm.patchValue({ profile: '' });
    }

    getProfileFileName(): string {
        return this.selectedProfileFile ? this.selectedProfileFile.name : '';
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

    onProfileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.selectedImage = file;
            this.selectedProfileFile = file;
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                this.profileImageUrl = e.target?.result as string;
            };
            reader.readAsDataURL(file);
            
            this.userForm.patchValue({ profile: file });
        } else {
            this.selectedImage = null;
            this.selectedProfileFile = null;
            this.profileImageUrl = null;
        }
    }

    onKycSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.selectedKycFile = file;
            
            // Create preview URL for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.kycDocumentUrl = e.target?.result as string;
                };
                reader.readAsDataURL(file);
            } else {
                this.kycDocumentUrl = null;
            }
            
            this.userForm.patchValue({ kyc: file });
        } else {
            this.selectedKycFile = null;
            this.kycDocumentUrl = null;
        }
    }
}

