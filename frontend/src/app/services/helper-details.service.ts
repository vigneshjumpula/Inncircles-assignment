import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class HelperDetailsService {
  
  public readonly helpers: WritableSignal<any[]> = signal<any[]>([]);
  // Signal to store original (total) helpers list for count
  //public readonly originalHelpers: WritableSignal<any[]> = signal<any[]>([]);
  private readonly filter: WritableSignal<any[]> = signal<any[]>([]);
  private isEditMode: boolean = false;
  private editingHelperId: string | null = null;
  constructor(private http: HttpClient) {
    
    // Initial load: set both original and current helpers
    this.loadHelpers().subscribe({
      next: data => {
        this.filter.set(data);
        this.helpers.set(data);
      },
      error: err => console.error('Failed to load initial helpers:', err)
    });
  }

  perDetails: any;
  Document: any;

  /**
   * Returns the cached helpers array synchronously
   */
  getHelpers(): any[] {
    console.log('Returning cached helpers:', this.helpers);
  return this.helpers();
  }
  getFilter(): any[] {
    return this.filter();
  }   

  setFilter(filter: any[]): void {
    this.filter.set(filter);
  }

  // Manually overwrite cached helpers
  setHelpers(helpers: any[]): void {
    this.helpers.set(helpers);
  }
 
  loadHelpers(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/helpers')
      .pipe(
        tap(data => {
          // Update both original and current helpers on each load/reload
          this.filter.set(data);
          this.helpers.set(data);
          console.log('Helpers fetched and cached:', this.helpers());
        }),
        catchError(error => throwError(() => error))
      );
  }
 
  getHelperById(id: string): any {
    const list = this.helpers();
    return list.find(h => h._id === id || h.id === id);
  }
 
  setHelperDetails(details: any): void {
    this.perDetails = details;
  }

  getHelperDetails(): any {
    // Return helper details for review/display purposes
    return this.perDetails;
  }

  // Method to set edit mode and helper ID
  setEditMode(isEdit: boolean, helperId?: string): void {
    this.isEditMode = isEdit;
    this.editingHelperId = helperId || null;
    if (!isEdit) {
      // Clear helper details when exiting edit mode
      this.perDetails = null;
      this.editingHelperId = null;
    }
  }

  // Method to check if currently in edit mode
  getEditMode(): boolean {
    return this.isEditMode;
  }

  // Method to get the ID of the helper being edited
  getEditingHelperId(): string | null {
    return this.editingHelperId;
  }

  setDocument(doc: any): void {
    this.Document = doc;
  }
 
  getDocument(): any {
    return this.Document;
  }

  addHelper(): Observable<any> {
   
    if (this.isEditMode && this.editingHelperId) {
      return this.updateHelper();
    }
    
    const payload = {
      type_of_service: this.perDetails.type_of_service,
      organization_name: this.perDetails.organization_name,
      full_name: this.perDetails.full_name,
      languages: this.perDetails.languages,
      gender: this.perDetails.gender,
      phone_number: this.perDetails.phone_number,
      email: this.perDetails.email,
      choose_vehicle: this.perDetails.choose_vehicle,
      // Include only small document references, not full base64 data
      kyc: this.perDetails.kyc ? 'document_uploaded' : '',
      // Skip large base64 document data to avoid payload size issues
    };
    
    // Debug payload size
    const payloadString = JSON.stringify(payload);
    const payloadSizeKB = Math.round(payloadString.length / 1024);
    const payloadSizeMB = Math.round(payloadSizeKB / 1024 * 100) / 100;
    console.log(`Simplified payload size: ${payloadSizeKB} KB (${payloadSizeMB} MB)`);
    console.log('Simplified payload:', payload);
    
    return this.http.post<any>('http://localhost:3000/api/helpers', payload)
      .pipe(
        tap(() => {
          
          this.loadHelpers().subscribe();
        }),
        catchError(error => throwError(() => error))
      );
  }


  updateHelper(): Observable<any> {
    if (!this.editingHelperId) {
      console.error('No editing helper ID available');
      return throwError(() => new Error('No helper ID for update'));
    }

    if (!this.perDetails) {
      console.error('No helper details available for update');
      return throwError(() => new Error('No helper details available for update'));
    }

    const payload = {
      type_of_service: this.perDetails.type_of_service,
      organization_name: this.perDetails.organization_name,
      full_name: this.perDetails.full_name,
      languages: this.perDetails.languages,
      gender: this.perDetails.gender,
      phone_number: this.perDetails.phone_number,
      email: this.perDetails.email,
      choose_vehicle: this.perDetails.choose_vehicle,
      kyc: this.perDetails.kyc ? 'document_uploaded' : '',
    };

    console.log('Updating helper with ID:', this.editingHelperId);
    console.log('Full helper ID length:', this.editingHelperId.length);
    console.log('Update payload:', payload);

    return this.http.put<any>(`http://localhost:3000/api/helpers/${this.editingHelperId}`, payload)
      .pipe(
        tap((response) => {
          console.log('Update response:', response);
          this.loadHelpers().subscribe();
        }),
        catchError(error => {
          console.error('Update failed with error:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          return throwError(() => error);
        })
      );
  }
  deleteHelper(id: string): Observable<any> {
    console.log("deleteHelper called with ID:", id);
    console.log("ID type:", typeof id);
    console.log("ID length:", id.length);
    return this.http.delete<any>(`http://localhost:3000/api/helpers/${id}`)
      .pipe(
        tap(() => {
          console.log("Delete successful, reloading helpers");
          this.loadHelpers().subscribe();
        }),
        catchError(error => {
          console.error("Delete failed:", error);
          return throwError(() => error);
        })
      );
  }

  refreshHelpers(): Observable<any[]> {
    return this.loadHelpers();
  }
}
