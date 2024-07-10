import { Component, OnInit } from '@angular/core';
import {FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../data-type';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-seller-add-product',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './seller-add-product.component.html',
  styleUrl: './seller-add-product.component.css'
})
export class SellerAddProductComponent implements OnInit{
  addProductMessage: string|undefined;
constructor(private product:ProductService){}

ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  
}
  submit(data:Product){
    this.product.addProduct(data).subscribe((result) =>{
      // console.log(result);
      if(result){
        this.addProductMessage = "Product added successfully";
        this.addProductMessage = ""
        // console.log(this.addProductMessage)
      }
      setTimeout(() => {
        this.addProductMessage=undefined
      }, 3000);
    });
  }
}
