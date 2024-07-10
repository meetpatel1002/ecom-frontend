import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../data-type';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  searchResult: undefined | Product[];
  noResultFound: boolean = false;
  constructor(
    private activeRoute: ActivatedRoute,
    private product: ProductService
  ) {}

  ngOnInit(): void {
    let query = this.activeRoute.snapshot.paramMap.get('query');
    query &&
      this.product.searchProducts(query).subscribe((result) => {
        if (result && result.length) {
          this.searchResult = result;
          this.noResultFound = false
        }else{
          this.noResultFound=true;
          this.searchResult=undefined
        }
      });
  }
}
