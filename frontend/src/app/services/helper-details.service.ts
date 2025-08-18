import { Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Helper } from '../models/helper.interface';

@Injectable({
  providedIn: 'root'
})

export class HelperDetailsService {

  public readonly helpers: WritableSignal<Helper[]> = signal<Helper[]>([]);
  private readonly filter: WritableSignal<Helper[]> = signal<Helper[]>([]);
  private isEditMode: boolean = false;
  private editingHelperId: string | null = null;
  perDetails: Helper | null = null;
  Document: File | null = null;

  constructor(private http: HttpClient) {
    this.loadHelpers().subscribe({
      next: data => {
        this.filter.set(data);
        this.helpers.set(data);
      },
      error: err => console.error('Failed to load initial helpers:', err)
    });
  }

  loadHelpers(): Observable<Helper[]> {
    return this.http.get<Helper[]>('http://localhost:3000/api/helpers')
      .pipe(
        tap(data => {  
          this.filter.set(data);
          this.helpers.set(data);
        }),
        catchError(error => throwError(() => error))
      );
  }
  

  getHelpers(): Helper[] {
    console.log('Returning cached helpers:', this.helpers);
    return this.helpers();
  }

  getFilter(): Helper[] {
    return this.filter();
  }   

  setFilter(filter: Helper[]): void {
    this.filter.set(filter);
  }

  setHelpers(helpers: Helper[]): void {
    this.helpers.set(helpers);
  }
  
 
  getHelperById(id: string): Helper | undefined {
    const list = this.helpers();
    return list.find(h => h._id === id || h.id === id);
  }
  
  setHelperDetails(details: Helper | null): void {
    console.log('Setting helper details-----:', details);
    this.perDetails = details;
  }

  getHelperDetails(): Helper | null {
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

  setDocument(doc: File | null): void {
    this.Document = doc;
  }

  getDocument(): File | null {
    return this.Document;
  }

  addHelper(): Observable<Helper> {
   
    if (this.isEditMode && this.editingHelperId) {
      return this.updateHelper();
    }
    
    if (!this.perDetails) {
      return throwError(() => new Error('No helper details available'));
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

  
    if (this.perDetails.profile instanceof File) {
      formData.append('profile', this.perDetails.profile);
    }

    if (this.perDetails.kyc instanceof File) {
      formData.append('kyc', this.perDetails.kyc);
    }

   
    if (this.Document instanceof File) {
      formData.append('document', this.Document);
    }

    console.log('Form Data to be sent:', formData);
    return this.http.post<Helper>('http://localhost:3000/api/helpers', formData)
      .pipe(
        tap(() => this.loadHelpers().subscribe()),
        catchError(error => throwError(() => error))
      );
  }
  updateHelper(): Observable<Helper> {
    if (!this.editingHelperId) {
      console.error('No editing helper ID available');
      return throwError(() => new Error('No helper ID for update'));
    }

    if (!this.perDetails) {
      console.error('No helper details available for update');
      return throwError(() => new Error('No helper details available for update'));
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
    

    if (this.perDetails.profile instanceof File) {
      formData.append('profile', this.perDetails.profile);
    }

   
    if (this.perDetails.kyc instanceof File) {
      formData.append('kyc', this.perDetails.kyc);
    }

  
    if (this.Document instanceof File) {
      formData.append('document', this.Document);
    }

    console.log('Update FormData to be sent:', formData);
    
    return this.http.put<Helper>(`http://localhost:3000/api/helpers/${this.editingHelperId}`, formData)
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

  deleteHelper(id: string): Observable<Helper> {
    console.log("deleteHelper called with ID:", id);
    console.log("ID type:", typeof id);
    console.log("ID length:", id.length);
    return this.http.delete<Helper>(`http://localhost:3000/api/helpers/${id}`)
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

  refreshHelpers(): Observable<Helper[]> {
    return this.loadHelpers();
  }
}
