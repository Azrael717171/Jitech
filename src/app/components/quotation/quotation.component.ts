import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-quotation',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.css']
})
export class QuotationComponent implements OnInit {
  showModal = false;
  products: any[] = [];
  selectedProducts: any[] = [];
  isLoading = false;
  searchTerm: string = ''; // search term for filtering inventory

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

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
}