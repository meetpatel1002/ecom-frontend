import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductService } from '../services/product.service';
import { Product } from '../data-type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgbModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  popularProducts: undefined | Product[];
  trendyproducts: undefined | Product[];
  constructor(private product: ProductService) {}

  ngOnInit(): void {
    this.product.popularProducts().subscribe((data) => {
      this.popularProducts = data;
    });
    this.product.trendyProducts().subscribe((data => {
      this.trendyproducts = data;
    }))
  }
}
