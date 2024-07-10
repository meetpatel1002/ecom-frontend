import { Component, OnInit } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Cart, Order } from '../data-type';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  totalPrice: number | undefined;
  cartData: Cart[] | undefined;
  orderMsg: string | undefined;

  constructor(private product: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.product.currentCart().subscribe((result) => {
      let price = 0;
      this.cartData = result;
      result.forEach((item) => {
        if (item.quantity) price += item.price * item.quantity;
      });
      this.totalPrice = price + price / 10 + 100 - price / 10;

      console.log(this.totalPrice);
    });
  }

  orderNow(data: { email: string; address: string; contact: string }) {
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user)._id : undefined;

    if (this.totalPrice && userId) {
      const orderData: Order = {
        ...data,
        totalPrice: this.totalPrice,
        userId,
        _id: undefined,
      };

      this.cartData?.forEach((item) => {
        if (item._id) this.product.deleteCartItems(item._id);
      });

      this.product.orderNow(orderData).subscribe((result) => {
        if (result) {
          this.orderMsg = 'Your Order has been Placed';
          setTimeout(() => {
            this.router.navigate(['/my-orders']);
            this.orderMsg = undefined;
          }, 3000);
        }
      });
    }
  }
}
