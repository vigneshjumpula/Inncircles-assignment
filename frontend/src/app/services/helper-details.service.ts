import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class HelperDetailsService {
  private helpers: any[] = [];
  constructor(private http: HttpClient) { }
  perDetails: any;
  Document: any;

  getHelpers(): any[] {
    console.log('Fetching helpers from cache:', this.helpers);
    return this.helpers;
  }
  // Store basic helper details from form
  setHelperDetails(details: any): void {
    this.perDetails = details;
  }
  // Retrieve stored helper details
  getHelperDetails(): any {
    return this.perDetails;
  }
  // Store uploaded document
  setDocument(doc: any): void {
    this.Document = doc;
  }
  // Retrieve stored document
  getDocument(): any {
    return this.Document;
  }
  // Final submission to backend
  addHelper(): Observable<any> {
    const payload = { ...this.perDetails, document: this.Document };
    return this.http.post<any>('http://localhost:3000/api/helpers', payload)
      .pipe(
        catchError(error => throwError(() => error))
      );
  }

}