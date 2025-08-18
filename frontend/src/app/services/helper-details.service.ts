import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class HelperDetailsService {
  
  public readonly helpers: WritableSignal<any[]> = signal<any[]>([]);
  private readonly filter: WritableSignal<any[]> = signal<any[]>([]);
  private isEditMode: boolean = false;
  private editingHelperId: string | null = null;
  perDetails: any;
  Document: any;

  constructor(private http: HttpClient) {
    this.loadHelpers().subscribe({
      next: data => {
        this.filter.set(data);
        this.helpers.set(data);
      },
      error: err => console.error('Failed to load initial helpers:', err)
    });
  }
  
  loadHelpers(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/api/helpers')
      .pipe(
        tap(data => {  
          this.filter.set(data);
          this.helpers.set(data);
          console.log('Helpers fetched and cached:', this.helpers());
        }),
        catchError(error => throwError(() => error))
      );
  }
  

 
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

  setHelpers(helpers: any[]): void {
    this.helpers.set(helpers);
  }
 
 
  getHelperById(id: string): any {
    const list = this.helpers();
    return list.find(h => h._id === id || h.id === id);
  }
 
  setHelperDetails(details: any): void {
    console.log('Setting helper details-----:', details);
    this.perDetails = details;
  }

  getHelperDetails(): any {
    return this.perDetails;
  }

  setEditMode(isEdit: boolean, helperId?: string): void {
    this.isEditMode = isEdit;
    this.editingHelperId = helperId || null;
    if (!isEdit) {
      this.perDetails = null;
      this.editingHelperId = null;
    }
  }

  getEditMode(): boolean {
    return this.isEditMode;
  }


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
    
    const formData = new FormData();
    const languages = typeof this.perDetails.languages === 'string' 
      ? this.perDetails.languages.split(',').map((lang: string) => lang.trim())
      : this.perDetails.languages;

    formData.append('type_of_service', this.perDetails.type_of_service);
    formData.append('organization_name', this.perDetails.organization_name);
    formData.append('full_name', this.perDetails.full_name);
    formData.append('languages', JSON.stringify(languages)); 
    formData.append('gender', this.perDetails.gender);
    formData.append('phone_number', String(this.perDetails.phone_number));
    formData.append('email', this.perDetails.email);
    formData.append('choose_vehicle', this.perDetails.choose_vehicle);

    // Handle profile file upload
    if (this.perDetails.profile instanceof File) {
      formData.append('profile', this.perDetails.profile);
    }

    // Handle KYC file upload
    if (this.perDetails.kyc instanceof File) {
      formData.append('kyc', this.perDetails.kyc);
    }

  console.log('Form Data to be sent:', formData);
  return this.http.post<any>('http://localhost:3000/api/helpers', formData)
    .pipe(
      tap(() => this.loadHelpers().subscribe()),
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

    
    const formData = new FormData();
    
    // Convert languages to array if it's a string
    const languages = typeof this.perDetails.languages === 'string' 
      ? this.perDetails.languages.split(',').map((lang: string) => lang.trim())
      : this.perDetails.languages;

    formData.append('type_of_service', this.perDetails.type_of_service);
    formData.append('organization_name', this.perDetails.organization_name);
    formData.append('full_name', this.perDetails.full_name);
    formData.append('languages', JSON.stringify(languages)); // Send as JSON string
    formData.append('gender', this.perDetails.gender);
    formData.append('phone_number', String(this.perDetails.phone_number));
    formData.append('email', this.perDetails.email);
    formData.append('choose_vehicle', this.perDetails.choose_vehicle);

    // Handle profile file upload - only append if it's a new File object
    if (this.perDetails.profile instanceof File) {
      formData.append('profile', this.perDetails.profile);
    }

    // Handle KYC file upload - only append if it's a new File object
    if (this.perDetails.kyc instanceof File) {
      formData.append('kyc', this.perDetails.kyc);
    }

    console.log('Update FormData to be sent:', formData);
    
    return this.http.put<any>(`http://localhost:3000/api/helpers/${this.editingHelperId}`, formData)
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
