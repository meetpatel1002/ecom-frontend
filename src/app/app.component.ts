import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { SellerService } from './services/seller.service';
import { FooterComponent } from './footer/footer.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ HeaderComponent,FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecommerce';
 
}