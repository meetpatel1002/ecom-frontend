import { EventEmitter, Injectable } from '@angular/core';
import { Login, Signup } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  invalidUser = new EventEmitter<boolean>()
  constructor(private http: HttpClient, private router: Router) {}

  userSignUp(user: Signup) {
    this.http
      .post('http://localhost:8080/seller', user, { observe: 'response' })
      .subscribe((result) => {
        if (result) {
          localStorage.setItem('user', JSON.stringify(result.body));
          this.router.navigate(['/']);
        }
      });
  }

  userLogin(data: Login) {
    this.http
      .get<Signup[]>(
        `http://localhost:8080/seller/login?email=${data.email}&password=${data.password}`,
        { observe: 'response' }
      )
      .subscribe((result) => {
        if (result && result.body) {
          // console.log(result.body,"llllllllllllllll")
          this.invalidUser.emit(false)
          localStorage.setItem('user', JSON.stringify(result.body));
          this.router.navigate(['/']);
        }
        else{
          this.invalidUser.emit(true)
        }
      });
  }
  userAuthReload(){
    if(localStorage.getItem("user")){
      this.router.navigate(['/'])
    }
  }
}
