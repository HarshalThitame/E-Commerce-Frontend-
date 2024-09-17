import {Component, OnInit} from '@angular/core';
import {OrderService} from "../../../services/order.service";
import {ProductService} from "../../../services/product.service";
import {LoginService} from "../../../services/login.service";
import {Router} from "@angular/router";
import {StockHistoryService} from "../../../services/stock-history.service";
import {SellerService} from "../../../services/seller.service";

interface Order {
  id: number;
  user: {};
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  discount: number;
  images: any[];
  seller: { };
  categories: number[];
  subCategories: number[];
  subSubCategories: number[];
  productHighlights: any[];
  reviewsAndRatings: any[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: number;
  order: Order;
  product: Product;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductSales {
  productId: number;
  productName: string;
  totalSales: number;
}


@Component({
  selector: 'app-seller-inventory',
  templateUrl: './seller-inventory.component.html',
  styleUrl: './seller-inventory.component.css'
})
export class SellerInventoryComponent implements OnInit {
  stockLevels :any;
  stockHistory :any;

  warehouseManagement = [
    { warehouse: 'Warehouse A', location: 'New York', stock: 500 },
    { warehouse: 'Warehouse B', location: 'Los Angeles', stock: 300 },
    { warehouse: 'Warehouse C', location: 'Chicago', stock: 200 },
    { warehouse: 'Warehouse D', location: 'Houston', stock: 150 },
  ];

  inventoryAlerts :any = [];



  lessSellingProducts = [
    { product: 'Product C', sales: 150 },
    { product: 'Product E', sales: 120 },
    { product: 'Product F', sales: 80 },
  ];
  user: any;
  orderItems: any;
  topSellingProducts: any;

  constructor(private _orderService:OrderService,
              private _productService:ProductService,
              private _loginService:LoginService,
              private _stockHistoryService:StockHistoryService,
              private _sellerService:SellerService,
              private _router:Router) { }

  ngOnInit(): void {
    this._loginService.getCurrentUser().subscribe((data: any) => {
      this.user = data;
      this.loadStockLevels();
      this.loadStockHistory();
      this.loadOrderItem();
    },error => {
      this._loginService.logout()
    })


  }

  loadOrderItem() {
        this._sellerService.getAllOrderBySeller(this.user.id).subscribe(data => {
          this.orderItems = data

          this.topSellingProducts = this.getTopSellingProducts(this.orderItems, this.orderItems.length);
        },error => {
          console.log(error);
        })
    }

  loadStockHistory() {
        this._stockHistoryService.getHistoryBySeller(this.user.id).subscribe((data: any) => {
          this.stockHistory = data;
        })
    }

  loadStockLevels() {
    this._productService.getProductBySeller(this.user.id).subscribe((data: any) => {
      this.stockLevels = data;
      this.loadInventoryAlerts()

    })
    }


   getTopSellingProducts(orderItems: OrderItem[], topN: number = 5): ProductSales[] {
    // Step 1: Aggregate sales data
    const salesMap: { [key: number]: { productName: string; totalSales: number } } = {};

    orderItems.forEach(item => {
      const productId = item.product.id;
      const salesAmount = item.quantity * item.price;

      if (salesMap[productId]) {
        salesMap[productId].totalSales += salesAmount;
      } else {
        salesMap[productId] = { productName: item.product.name, totalSales: salesAmount };
      }
    });

    // Step 2: Convert salesMap to an array and sort by totalSales
    const sortedProducts = Object.entries(salesMap)
      .map(([productId, productSales]) => ({
        productId: parseInt(productId, 10),
        productName: productSales.productName,
        totalSales: productSales.totalSales
      }))
      .sort((a, b) => b.totalSales - a.totalSales);

    // Step 3: Get the top N selling products
    return sortedProducts.slice(0, topN);
  }

  loadInventoryAlerts() {
    for (let i = 0; i < this.stockLevels.length; i++) {
      if(this.stockLevels[i].stockQuantity == 0)
      {
        this.stockLevels[i].status = "OUT OF STOCK"
        this.inventoryAlerts.push(this.stockLevels[i]);


      }else if(this.stockLevels[i].stockQuantity <= 5)
      {
        this.stockLevels[i].status = "CRITICAL STOCK"
        this.inventoryAlerts.push(this.stockLevels[i]);

      } else if(this.stockLevels[i].stockQuantity <= 10)
      {
        this.stockLevels[i].status = "LOW STOCK"
        this.inventoryAlerts.push(this.stockLevels[i]);
      }
    }
    this.inventoryAlerts.sort((a: { stockQuantity: number; }, b: { stockQuantity: number; }) => a.stockQuantity - b.stockQuantity);

  }
}
