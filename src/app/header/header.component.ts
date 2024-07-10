import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink, RouterOutlet } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../data-type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone:true,
  imports:[CommonModule,RouterLink,RouterOutlet]
})
export class HeaderComponent implements OnInit {
  menuType: string = 'default';
  sellerName: string = '';
  userName: string = '';
  searchResult: Product[] | undefined;
  cartItems = 0;

  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateMenuType(event.url);
      }
    });

    this.subscribeToCartUpdates(); // Subscribe to cart updates
  }

  private updateMenuType(url: string): void {
    if (localStorage.getItem('seller') && url.includes('seller')) {
      const sellerStore = localStorage.getItem('seller');
      const sellerData = sellerStore ? JSON.parse(sellerStore) : null;
      if (sellerData) {
        this.sellerName = sellerData.name;
        this.menuType = 'seller';
      }
    } else if (localStorage.getItem('user')) {
      const userStore = localStorage.getItem('user');
      const userData = userStore ? JSON.parse(userStore) : null;
      if (userData) {
        this.userName = userData.name;
        this.menuType = 'user';
        this.productService.getCartList(userData._id);
      }
    } else {
      this.menuType = 'default';
    }
  }

  private subscribeToCartUpdates(): void {
    this.productService.cartData$.subscribe((items) => {
      this.cartItems = items.length; // Update cartItems whenever cartData$ emits
    });
  }

  logout(): void {
    localStorage.removeItem('seller');
    this.router.navigate(['/']);
    this.productService.clearCartData();
  }

  searchProduct(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value) {
      this.productService.searchProducts(inputElement.value).subscribe((result) => {
        this.searchResult = result.length > 5 ? result.slice(0, 5) : result;
      });
    }
  }

  hideSearch(): void {
    this.searchResult = undefined;
  }

  redirectToDetails(id: number): void {
    this.router.navigate(['/details/' + id]);
  }

  submitSearch(value: string): void {
    this.router.navigate([`search/${value}`]);
  }

  userLogout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/user-auth']);
    this.productService.clearCartData();
  }
}
