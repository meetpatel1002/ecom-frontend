import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Login, Signup } from '../data-type';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class SellerService {
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginError= new EventEmitter<boolean>(false)
  constructor(private http: HttpClient, private router:Router) {}

  signUp(data: Signup) {
    this.http
      .post('https://ecomm-backend-eight.vercel.app/users', data, {
        observe: 'response',
      })
      .subscribe((result) => {
        this.isSellerLoggedIn.next(true);
        localStorage.setItem('seller',JSON.stringify(result.body))
        this.router.navigate(['/seller-home']);
      });
  }
  reloadSeller() {
    if(localStorage.getItem('seller')){
      this.isSellerLoggedIn.next(true); 
      this.router.navigate(['/seller-home']);
    }
  }

  Login(data:Login){
    this.http.get<any>(`https://ecomm-backend-eight.vercel.app/users/login?email=${data.email}&password=${data.password}`,
    {observe:'response'}).subscribe((result:any)=>{
     console.warn(result)
     if(result && result.body){
       this.isLoginError.emit(false)
       localStorage.setItem('seller',JSON.stringify(result.body))
       this.router.navigate(['seller-home'])
     }
     else{
       this.isLoginError.emit(true)
     }
    })
   }
}
