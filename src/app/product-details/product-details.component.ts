import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Cart, Product } from '../data-type';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  productData: Product | undefined;
  productQuantity: number = 1;
  removeCart = false;
  cartData: Product | undefined;
  private subscriptions: Subscription[] = [];

  constructor(
    private activeRoute: ActivatedRoute,
    private product: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const productId = this.activeRoute.snapshot.paramMap.get('productId');
    console.warn(productId);
    if (productId) {
      const sub = this.product.getProduct(productId).subscribe((result) => {
        this.productData = result;
        this.checkLocalCart(productId);
        this.checkUserCart(productId);
      });
      this.subscriptions.push(sub);
    }
  }

  private checkLocalCart(productId: string): void {
    const cartData = localStorage.getItem('localCart');
    if (cartData) {
      const items = JSON.parse(cartData).filter(
        (item: Product) => productId === item._id.toString()
      );
      this.removeCart = items.length;
    }
  }

  private checkUserCart(productId: string): void {
    const user = localStorage.getItem('user');
    if (user) {
      const userId = JSON.parse(user)._id;
      this.product.getCartList(userId);
      const sub = this.product.cartData$.subscribe((result) => {
        const item = result.filter(
          (item: Product) => productId === item.productId?.toString()
        );
        this.cartData = item[0];
        this.removeCart = item.length > 0;
      });
      this.subscriptions.push(sub);
    }
  }

  handleQuantity(val: string): void {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }

  addToCart(): void {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;
      if (!localStorage.getItem('user')) {
        this.product.localAddToCart(this.productData);
        this.removeCart = true;
      } else {
        const user = localStorage.getItem('user');
        const userId = user && JSON.parse(user)._id;
        const cartData: Cart = {
          ...this.productData,
          userId,
          productId: this.productData._id,
        };
        delete cartData._id;
        const sub = this.product.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.product.getCartList(userId);
            this.removeCart = true;
          }
        });
        this.subscriptions.push(sub);
      }
    }
  }

  removeFromCart(productId: number): void {
    if (!localStorage.getItem('user')) {
      this.product.removeItemFromCart(productId);
    } else {
      let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user)._id;
      console.warn(this.cartData);
      this.cartData &&
        this.product.removeFromCart(this.cartData._id).subscribe((result) => {
          if (result) {
            this.product.getCartList(userId);
          }
        });
      this.removeCart = false;
    }
  }

  buyNow() {
    this.addToCart();
    this.router.navigate(['cart-page']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
