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
  inventory: any[] = [];
  selectedProducts: any[] = [];
  isLoading = false;
  searchTerm: string = ''; // search term for filtering inventory

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService
  ) {}

  ngOnInit() {
    this.loadInventory();
  }

  // Returns inventory filtered by search term
  get filteredInventory() {
    if (!this.searchTerm) {
      return this.inventory;
    }
    const term = this.searchTerm.toLowerCase();
    return this.inventory.filter(product =>
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

  loadInventory() {
    this.isLoading = true;
    this.inventoryService.getInventory(1, 1000, 'updatedAt', 'desc').subscribe(
      (response) => {
        this.isLoading = false;
        // Adjust based on your API response
        this.inventory = response.data || response;
        console.log('✅ Loaded Inventory:', this.inventory);
      },
      (error) => {
        this.isLoading = false;
        console.error('❌ Error loading inventory:', error);
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
