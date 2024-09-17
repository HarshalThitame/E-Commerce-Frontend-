import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-seller-products',
  templateUrl: './seller-products.component.html',
  styleUrl: './seller-products.component.css'
})
export class SellerProductsComponent implements OnInit{
  products = [
    {
      id: 1,
      imageUrl: 'https://via.placeholder.com/100',
      name: 'Product Name 1',
      category: 'Category 1',
      price: 999.00,
      stock: 20,
      status: 'Active'
    },
    // Add more products as needed
  ];

  constructor() { }

  ngOnInit(): void {
  }

  addProduct(): void {
    // Implement add product functionality
  }

  editProduct(productId: number): void {
    // Implement edit product functionality
  }

  deleteProduct(productId: number): void {
    // Implement delete product functionality
  }
}
