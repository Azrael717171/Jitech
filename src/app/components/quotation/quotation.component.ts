import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuotationService } from '../../services/quotation.service';
import { Quotation } from '../../models/quotation';


@Component({
  selector: 'app-quotation',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.css'
})
export class QuotationComponent implements OnInit {

  showModal = false;
  formData: Quotation = this.getEmptyQuotation();

  constructor(private quotationService: QuotationService) {}

  ngOnInit() {
    this.loadLatestQuotation();
  }

  open() {
    this.formData = this.getEmptyQuotation(); // Reset form for new quotation
    this.showModal = true;
  }

  close() {
    this.showModal = false;
  }

  submit() {
    this.quotationService.addQuotation(this.formData).subscribe(response => {
      console.log('Quotation saved:', response);
      this.loadLatestQuotation(); // Fetch only the latest quotation after saving
      this.close();
    });
  }

  loadLatestQuotation() {
    this.quotationService.getLatestQuotation().subscribe(latestQuotation => {
      this.formData = latestQuotation; // Display only the latest quotation
    });
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US');
  }



  private getEmptyQuotation(): Quotation {
    return {
      quotationNumber: '',
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
