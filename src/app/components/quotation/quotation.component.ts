import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuotationService } from '../../services/quotation.service';
import { Quotation } from '../../models/quotation';
import { ProductService } from '../../services/product.service';
import { InventoryService } from '../../services/inventory.service';


@Component({
  selector: 'app-quotation',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.css'
})
export class QuotationComponent implements OnInit {

  showModal = false;
  products: any[] = [];
  selectedProducts: any[] = [];
  isLoading = false;
  searchTerm: string = ''; // search term for filtering inventory


  formData: Quotation = this.getEmptyQuotation();

  constructor(private quotationService: QuotationService,  private productService: ProductService,
    private inventoryService: InventoryService) {}

  ngOnInit() {
    this.loadLatestQuotation();
    this.loadProducts();
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


  //jerico

  // Returns inventory filtered by search term
  get filteredInventory() {
    if (!this.searchTerm) {
      return this.products;
    }
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(product =>
      product.productName.toLowerCase().includes(term) ||
      (product.sku && product.sku.toLowerCase().includes(term)) ||
      (product.category && product.category.toLowerCase().includes(term))
    );
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    // Optionally clear search term when modal closes
    this.searchTerm = '';
  }

  loadProducts() {
    this.productService.getProducts().subscribe(
      (response) => {
        // Only include products with stockLevel greater than 0.
        this.products = response.data.filter((product: { stockLevel: number; }) => product.stockLevel > 0);
      },
      (error) => {
        console.error('❌ Error loading products:', error);
      }
    );
  }

  // Validate desired quantity to ensure it is between 1 and product.stockLevel
  validateDesiredQty(product: any) {
    if (!product.desiredQty || product.desiredQty < 1) {
      product.desiredQty = 1;
    }
    if (product.stockLevel && product.desiredQty > product.stockLevel) {
      product.desiredQty = product.stockLevel;
    }
  }


  // Toggle individual product selection.
  // Also, the product.desiredQty should already be entered in the modal.
  toggleSelection(product: any, event: any) {
    if (event.target.checked) {
      // Set default quantity if not provided
      if (!product.desiredQty || product.desiredQty < 1) {
        product.desiredQty = 1;
      }
      this.selectedProducts.push(product);
    } else {
      this.selectedProducts = this.selectedProducts.filter(p => p !== product);
    }
  }

  // Toggle selection for all filtered products
  toggleAllSelection(event: any) {
    if (event.target.checked) {
      this.selectedProducts = [...this.filteredInventory];
      // Set default quantity for each product if not provided
      this.selectedProducts.forEach(product => {
        if (!product.desiredQty || product.desiredQty < 1) {
          product.desiredQty = 1;
        }
      });
    } else {
      this.selectedProducts = [];
    }
  }

  // Adds selected products from the modal to the quotation.
  // Copies the desired quantity into product.qty.
  addSelectedProducts() {
    this.selectedProducts.forEach(product => {
      product.qty = product.desiredQty ? product.desiredQty : 1;
    });
    console.log('Selected Products:', this.selectedProducts);
    this.closeModal();
  }

  // Final submission of the quotation
  submitQuotation() {
    console.log('Quotation Submitted:', this.selectedProducts);
  }

   // Example computed properties
   get subTotal(): number {
    // Sum of (price * qty - discount) for each product
    return this.selectedProducts.reduce((sum, product) => {
      const itemTotal = (product.price * product.qty) - (product.discount || 0);
      return sum + itemTotal;
    }, 0);
  }


  get vatAmount(): number {
    // 12% of taxableAmount
    const total = this.subTotal - this.taxableAmount;
    return total;
  }


  get taxableAmount(): number {
    // Example logic: maybe the taxable amount is subTotal minus any exempt portion
    // For now, let's assume it's just subTotal
      return this.subTotal / 1.12;
  }


  get grandTotal(): number {
    // subTotal + VAT (if your pricing is not already VAT inclusive)
    // or if your subTotal is inclusive, you might not add it again
    // This depends on your own logic.

    return this.subTotal;

  }

}
