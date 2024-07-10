import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Order } from '../data-type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  orderData: Order[] | undefined;

  constructor(private product: ProductService) {}

  ngOnInit(): void {
    this.getOrderList();
  }

  cancelOrder(orderId: number | undefined): void {
    if (orderId) {
      this.product.cancelOrder(orderId).subscribe(() => {
        this.orderData = this.orderData?.filter(order => order._id !== orderId);
      });
    }
  }

  getOrderList(): void {
    this.product.orderList().subscribe((result) => {
      this.orderData = result;
    });
  }
}
