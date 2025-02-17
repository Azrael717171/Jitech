import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Quotation } from '../models/quotation';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {
  private apiUrl = 'http://localhost:5000/api/quotations'; // Update with your backend URL

  constructor(private http: HttpClient) {}


  // Fetch only the latest quotation
  getLatestQuotation(): Observable<Quotation> {
    return this.http.get<Quotation[]>(this.apiUrl).pipe(
      map(quotations => quotations.length > 0 ? quotations[0] : this.getEmptyQuotation())
    );
  }

  // Save a new quotation
  addQuotation(quotation: Quotation): Observable<Quotation> {
    return this.http.post<Quotation>(this.apiUrl, quotation);
  }

  // Inline empty quotation object (Fix for the error)
  private getEmptyQuotation(): Quotation {
    return {
      companyName: '',
      address: '',
      contactNo: '',
      tin: '',
      clientName: '',
      quotationDate: '',
      expiryDate: '',
      reference: '',
      salesPerson: '',
      paymentTerm: ''
    };
  }
}
