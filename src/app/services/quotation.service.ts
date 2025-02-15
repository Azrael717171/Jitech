import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InventoryService } from './inventory.service';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {
  private apiUrl_Inventory = 'http://localhost:5000/api/inventory';

  constructor(public http: HttpClient) { }


  getInventory(){
    return this.http.get(this.apiUrl_Inventory);
  }
}


