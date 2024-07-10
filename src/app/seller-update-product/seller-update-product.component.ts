import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../data-type';
@Component({
  selector: 'app-seller-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-update-product.component.html',
  styleUrl: './seller-update-product.component.css'
})
export class SellerUpdateProductComponent {

  productData:undefined|Product
  productMessage:undefined|string
  constructor(private route: ActivatedRoute, private product:ProductService, private router: Router){}
  ngOnInit():void{
    let productId = this.route.snapshot.paramMap.get('_id')
    // console.log(productId)
    productId && this.product.getProduct(productId).subscribe((data) => {
      this.productData=data
    })
  }

  submit(data:Product){
    if(this.productData){
      data._id=this.productData._id
    }
    this.product.updateProduct(data).subscribe((result)=>{
      if(result){
        this.productMessage="Product Updated Sucessfully"
      }
    });
    setTimeout(() => {
      this.router.navigate(['/seller-home'])
    },1000)
  }
}
