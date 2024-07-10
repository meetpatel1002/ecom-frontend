import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Login, Signup } from '../data-type';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-seller-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css'],
})
export class SellerAuthComponent implements OnInit {
  showLogin = false
  authError:String = "";
  constructor(
    private sellerService: SellerService,
    private router: Router,
    private seller: SellerService
  ) {}

  ngOnInit(): void {
    this.seller.reloadSeller();
    
  }

  signUp(data: Signup): void {
    this.sellerService.signUp(data);
  }

  login(data: Login):void{
    // console.log(data);
    this.seller.Login(data);
    this.seller.isLoginError.subscribe((isError)=>{
      if(isError){
        this.authError="Email or password is not correct";
      }else{
        this.authError = "";
        // this.router.navigate(['/seller-home']);
      }
    })
   
  }
  openLogin(){
    this.showLogin = true;
  }

  openSignUp(){
    this.showLogin = false;
  }
}
