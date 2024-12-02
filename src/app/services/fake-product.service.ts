import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/fake-product/Product';

@Injectable({
  providedIn: 'root'
})
export class FakeProductService {

  fake_products_url : string = '/assets/data/products.json';

  constructor(private http: HttpClient) 
  { }

  getFake_Products(): Observable<Product>  {
  
    return this.http.get<Product>(this.fake_products_url);
      
  }

}
