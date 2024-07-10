import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cart, Order, Product } from '../data-type';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private cartDataSubject = new BehaviorSubject<Product[]>([]);
  cartData$ = this.cartDataSubject.asObservable();

  constructor(private http: HttpClient) {
   this.loadLocalCart()
  }

  private loadLocalCart(): void {
    const cartData = localStorage.getItem('localCart');
    if (cartData) {
      this.cartDataSubject.next(JSON.parse(cartData));
    }
  }

  addProduct(data: Product): Observable<any> {
    return this.http.post('https://ecomm-backend-eight.vercel.app/products', data);
  }

  productList(): Observable<Product[]> {
    return this.http.get<Product[]>('https://ecomm-backend-eight.vercel.app/products');
  }

  deleteProduct(_id: number): Observable<any> {
    return this.http.delete(`https://ecomm-backend-eight.vercel.app/products/${_id}`);
  }

  getProduct(_id: string): Observable<Product> {
    return this.http.get<Product>(`https://ecomm-backend-eight.vercel.app/products/${_id}`);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(
      `https://ecomm-backend-eight.vercel.app/products/${product._id}`,
      product
    );
  }

  popularProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('https://ecomm-backend-eight.vercel.app/products?limit=5');
  }

  trendyProducts(): Observable<Product[]> {
    return this.http.get<Product[]>('https://ecomm-backend-eight.vercel.app/products?limit=8');
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`https://ecomm-backend-eight.vercel.app/products?search=${query}`);
  }

  localAddToCart(data: Product): void {
    let cartData = [];
    const localCart = localStorage.getItem('localCart');
    if (!localCart) {
      cartData = [data];
    } else {
      cartData = JSON.parse(localCart);
      cartData.push(data);
    }
    localStorage.setItem('localCart', JSON.stringify(cartData));
    this.updateCartData(cartData);
  }


  removeItemFromCart(productId: number): void {
    const cartData = localStorage.getItem('localCart');
    if (cartData) {
      let items: Product[] = JSON.parse(cartData);
      items = items.filter((item: Product) => item._id !== productId);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.updateCartData(items);
    }
  }

  addToCart(cartData: Cart): Observable<any> {
    return this.http.post('https://ecomm-backend-eight.vercel.app/cart', cartData);
  }

  getCartList(userId: number): void {
    this.http.get<Product[]>(`https://ecomm-backend-eight.vercel.app/cart/${userId}`, {
      observe: 'response',
    }).subscribe((result) => {
      if (result && result.body) {
        this.cartDataSubject.next(result.body);
      }
    });
  }

  removeFromCart(cartId: number): Observable<any> {
    return this.http.delete(`https://ecomm-backend-eight.vercel.app/cart/${cartId}`);
  }

  currentCart(): Observable<Cart[]> {
    const userStore = localStorage.getItem('user');
    const userData = userStore ? JSON.parse(userStore) : undefined;
    return this.http.get<Cart[]>(`https://ecomm-backend-eight.vercel.app/cart/user/${userData._id}`);
  }

  orderNow(data: Order): Observable<any> {
    return this.http.post('https://ecomm-backend-eight.vercel.app/orders', data);
  }

  orderList(): Observable<Order[]> {
    const userStore = localStorage.getItem('user');
    const userData = userStore ? JSON.parse(userStore) : undefined;
    return this.http.get<Order[]>(`https://ecomm-backend-eight.vercel.app/orders/${userData._id}`);
  }

  deleteCartItems(cartId: number): void {
    this.http.delete(`https://ecomm-backend-eight.vercel.app/cart/${cartId}`, { observe: 'response' })
      .subscribe((result) => {
        if (result) {
          this.cartDataSubject.next([]);
        }
      });
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.delete(`https://ecomm-backend-eight.vercel.app/orders/${orderId}`);
  }

  clearCartData(): void {
    localStorage.removeItem('localCart');
    this.updateCartData([]);
  }
  private updateCartData(data: Product[]): void {
    this.cartDataSubject.next(data); // Emit updated cart data
  }
}
