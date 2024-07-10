import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Cart, Price } from '../data-type';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  cartData: Cart[] | undefined;
  Price: Price = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
  };

  constructor(private product: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails(): void {
    this.product.currentCart().subscribe((result) => {
      this.cartData = result;
      this.updatePriceDetails();

      if (!this.cartData.length) {
        this.router.navigate(['/']);
      }
    });
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }

  removeCart(cartId: number | undefined): void {
    if (cartId) {
      this.product.removeFromCart(cartId).subscribe((result) => {
        if (result) {
          this.cartData = this.cartData?.filter(item => item._id !== cartId);
          this.updatePriceDetails();

          if (!this.cartData?.length) {
            this.router.navigate(['/']);
          }
        }
      });
    }
  }

  updatePriceDetails(): void {
    let price = 0;
    this.cartData?.forEach((item) => {
      if (item.quantity) price = price + +item.price * +item.quantity;
    });

    this.Price.price = price;
    this.Price.discount = price / 10;
    this.Price.tax = price / 10;
    this.Price.delivery = 100;
    this.Price.total = parseFloat(
      (
        price +
        this.Price.tax +
        this.Price.delivery -
        this.Price.discount
      ).toFixed(2)
    );
  }
}
