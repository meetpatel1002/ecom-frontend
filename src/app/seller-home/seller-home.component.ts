import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../data-type';
import { CommonModule } from '@angular/common';
import { faTrash,faEdit} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-seller-home',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule,RouterLink],
  templateUrl: './seller-home.component.html',
  styleUrl: './seller-home.component.css',
})
export class SellerHomeComponent implements OnInit {
  productList: undefined | Product[];
  productMessage: undefined | string;
  deleteIcon = faTrash
  editIcon = faEdit
  constructor(private product: ProductService) {}

  ngOnInit(): void {
    this.list();
  }
  deleteProduct(_id: number) {
    // console.log('test id', id);
    this.product.deleteProduct(_id).subscribe((result) => {
      if (result) {
        this.productMessage = 'Product is Deleted';
        this.list()
      }
    });
    setTimeout(() => {
      this.productMessage = undefined;
    }, 3000);
  }
  list() {
    this.product.productList().subscribe((result) => {
      // console.log(result);
      this.productList = result;
    });
  }
}
