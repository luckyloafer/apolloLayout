import { Injectable } from '@angular/core';
import {data} from '../mock-products'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  productsData: any[]=data;

  getProductsData(){
    return this.productsData;
  }

  getFilteredProductsData(searchTerm:string){

    const normalizedSearchTerm = searchTerm
      .trim()
      .replace(/\s+/g, ' ')
      .toLowerCase();
    const filteredData = this.productsData.filter((val)=>val.name.toLowerCase().includes(normalizedSearchTerm))
    return filteredData;
  }
}
