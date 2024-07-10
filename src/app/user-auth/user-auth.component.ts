import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Cart, Login, Product, Signup } from '../data-type';
import { UserService } from '../services/user.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-user-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.css',
})
export class UserAuthComponent implements OnInit {
  showLogin: boolean = true;
  authError: string = '';
  constructor(private user: UserService, private product:ProductService) {}

  ngOnInit(): void {
    this.user.userAuthReload();
  }

  signUp(data: Signup) {
    // console.log(data);
    this.user.userSignUp(data);
  }
  login(data: Login) {
    this.user.userLogin(data);
    this.user.invalidUser.subscribe((result) => {
      console.warn('LOGIN==>>', result);
      if (!result) {
        this.authError="";
        setTimeout(() => {
          this.localCartToRemoveCart();
        },1000)
      } else {
        this.authError="Invalid Credentials"
      }
    });
  }

  openSingUp() {
    this.showLogin = false;
  }

  openLogin() {
    this.showLogin = true;
  }

  localCartToRemoveCart() {
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user)._id;
    if (data) {
      let cartDataList: Product[] = JSON.parse(data);
      cartDataList.forEach((product: Product, index) => {
        let cartData: Cart = {
          ...product,
          productId: product._id,
          userId,
        };
        delete cartData._id;
        this.product.addToCart(cartData).subscribe((result) => {
          if (result) {
            console.log("Items updated in DB");
          }
        });
        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart');
        }
      });
    }
    setTimeout(() => {
      this.product.getCartList(userId)
    }, 100);
  }
  
}
