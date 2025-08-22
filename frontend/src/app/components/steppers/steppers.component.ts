import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HelperDetailsService } from '../../services/helper-details.service';
import { CommonModule } from '@angular/common';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-steppers',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './steppers.component.html',
  styleUrl: './steppers.component.scss'
})
export class SteppersComponent  {
  @ViewChild('stepper') stepper!: MatStepper;
  
  currentStep = 0;
  isEditMode = false;
  private routerSubscription?: Subscription;
  

  addSteps = [
    {
      label: 'Helper Details',
      route: '/add-helper/helper/form',
      icon: 'person',
      completed: false,
      active: false
    },
    {
      label: 'Document Upload',
      route: '/add-helper/helper/document',
      icon: 'upload_file',
      completed: false,
      active: false
    },
    {
      label: 'Review & Submit',
      route: '/add-helper/helper/review',
      icon: 'check_circle',
      completed: false,
      active: false
    }
  ];


  editSteps = [
    { 
      label: 'Helper Details', 
      route: '/edit-helper/form', 
      icon: 'person',
      completed: false, 
      active: false 
    },
    { 
      label: 'Documents', 
      route: '/edit-helper/document', 
      icon: 'upload_file',
      completed: false, 
      active: false 
    }
  ];
  get steps() {
    return this.isEditMode ? this.editSteps : this.addSteps;
  }

  constructor(
    private router: Router,
    private helperDetailsService: HelperDetailsService
  ) {}

  ngOnInit() {
    this.detectModeFromRoute();
    this.updateStepFromRoute();
    

    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.detectModeFromRoute();
      this.updateStepFromRoute();
      // Trigger change detection to refresh the stepper
      setTimeout(() => {
        if (this.stepper && !this.isEditMode) {
          this.stepper.selectedIndex = this.currentStep;
        }
      }, 0);
    });
  }

  private detectModeFromRoute() {
    const currentUrl = this.router.url;
    this.isEditMode = currentUrl.includes('/edit-helper/');
  }

  ngAfterViewInit() {
    
    if (this.stepper) {
      this.stepper.selectedIndex = this.currentStep;
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updateStepFromRoute() {
    const currentUrl = this.router.url;
    
    // Reset active state but preserve completion state
    this.steps.forEach((step, index) => {
      step.active = false;
    });

    if (currentUrl.includes('/form')) {
      this.currentStep = 0;
      this.steps[0].active = true;
      // Don't reset completion status when going back to form
    } else if (currentUrl.includes('/document')) {
      this.currentStep = 1;
      this.steps[1].active = true;
      
      // Mark form step as completed when moving to document step
      // Use both service completion status and form validation
      const isFormValid = this.isFormValid();
      const isMarkedComplete = this.helperDetailsService.isStepCompleted('form');
      
      if (!this.isEditMode) {
        this.steps[0].completed = isFormValid || isMarkedComplete;
      } else {
        // In edit mode, also mark form step as completed if valid or marked complete
        this.steps[0].completed = isFormValid || isMarkedComplete;
      }
    } else if (currentUrl.includes('/review') && !this.isEditMode) {
      this.currentStep = 2;
      this.steps[2].active = true;
      
      // Mark previous steps as completed
      const isFormValid = this.isFormValid();
      const isFormMarkedComplete = this.helperDetailsService.isStepCompleted('form');
      const isDocumentMarkedComplete = this.helperDetailsService.isStepCompleted('document');
      
      this.steps[0].completed = isFormValid || isFormMarkedComplete;
      this.steps[1].completed = true || isDocumentMarkedComplete; // Document step is optional but considered completed
    }

    if (this.stepper && !this.isEditMode) {
      this.stepper.selectedIndex = this.currentStep;
    }
  }

  private isFormValid(): boolean {
    const formDetails = this.helperDetailsService.getHelperDetails();
    
  
    if (!formDetails) return false;
    
    const requiredFields = [
      'full_name',
      'email', 
      'phone_number',
      'gender',
      'languages',
      'type_of_service',
      'organization_name',
      'choose_vehicle',
      'profile',
      'kyc_document'
    ];
  
    return requiredFields.every(field => {
      const value = formDetails[field];
      if (value === undefined || value === null) return false;
      if (field === 'languages') {
        return Array.isArray(value) && value.length > 0;
      }
      return value && value.toString().trim() !== '';
    });
  }

  canNavigateToStep(stepIndex: number): boolean {
    switch (stepIndex) {
      case 0: return true; 
      case 1: return this.isFormValid(); 
      case 2: return !this.isEditMode && this.isFormValid(); 
      default: return false;
    }
  }

  navigateToStep(stepIndex: number) {
    if (this.canNavigateToStep(stepIndex) && stepIndex < this.steps.length) {
      const step = this.steps[stepIndex];
      this.router.navigate([step.route]);
    } else {
      console.warn('Cannot navigate to this step. Please check requirements or step availability.');
    }
  }

  onStepClick(event: { selectedIndex: number }) {
    const stepIndex = event.selectedIndex;
    this.navigateToStep(stepIndex);
  }
}

