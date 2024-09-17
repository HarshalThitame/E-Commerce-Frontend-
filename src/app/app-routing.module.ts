import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {UserGuard} from "./guards/user.guard";
import {UserdashboardComponent} from "./pages/userdashboard/userdashboard.component";
import {AdminDashboardComponent} from "./pages/admin/admin-dashboard/admin-dashboard.component";
import {AdminGuard} from "./guards/admin.guard";
import {CreateCategoryComponent} from "./pages/admin/create-category/create-category.component";
import {SellerComponent} from "./pages/seller/seller.component";
import {SellerGuard} from "./guards/seller.guard";
import {ProductDetailComponent} from "./pages/product-detail/product-detail.component";
import {CartComponent} from "./pages/cart/cart.component";
import {AddImagesComponent} from "./pages/seller/add-images/add-images.component";
import {ProductsDetailsComponent} from "./pages/seller/products-details/products-details.component";
import {CheckoutComponent} from "./components/order/checkout/checkout.component";
import {AllProductsComponent} from "./pages/all-products/all-products.component";
import {ErrorComponent} from "./components/error/error.component";
import {MyOrdersComponent} from "./pages/my-orders/my-orders.component";
import {OrderInformationComponent} from "./pages/my-orders/order-information/order-information.component";
import {SellerDashboardComponent} from "./pages/seller/seller-dashboard/seller-dashboard.component";
import {SellerOrderComponent} from "./pages/seller/seller-order/seller-order.component";
import {SellerProductsComponent} from "./pages/seller/seller-products/seller-products.component";
import {
  SellerOrderInformationComponent
} from "./pages/seller/seller-order-information/seller-order-information.component";
import {SellerEditProductComponent} from "./pages/seller/seller-edit-product/seller-edit-product.component";
import {MyProfileComponent} from "./pages/my-profile/my-profile.component";
import {PersonalInfoComponent} from "./pages/my-profile/personal-info/personal-info.component";
import {ManageAddressesComponent} from "./pages/my-profile/manage-addresses/manage-addresses.component";
import {ProductInformationComponent} from "./pages/seller/product-information/product-information.component";
import {SellerProfileComponent} from "./pages/seller/seller-profile/seller-profile.component";
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {SignupPageComponent} from "./components/login-page/signup-page/signup-page.component";
import {ForgotPasswordComponent} from "./components/login-page/forgot-password/forgot-password.component";
import {
  SendOrderinfoEmailComponent
} from "./components/order/checkout/send-orderinfo-email/send-orderinfo-email.component";
import {SellerInventoryComponent} from "./pages/seller/seller-inventory/seller-inventory.component";
import {SellerAnalyticsComponent} from "./pages/seller/seller-analytics/seller-analytics.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'signup',
    component: SignupPageComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'user',
    canActivate: [UserGuard],
    children: [
      {
        path: '',
        component: UserdashboardComponent,
      }, {
        path: ':id',
        component: CartComponent
      },
      {
        path: 'my-orders/:id',
        component: MyOrdersComponent
      },
      {
        path: 'profile/my-profile',
        component: MyProfileComponent,
        children: [
          {
            path: 'personal-info',
            component: PersonalInfoComponent,
            pathMatch:"full"
          },
          {
            path: 'manage-addresses',
            component: ManageAddressesComponent,
            pathMatch:"full"
          }
        ]
      },
      {
        path: 'my-orders/order-information/:id',
        component: OrderInformationComponent
      },
      {
        path: 'product/:id',
        component: ProductDetailComponent
      },
      {
        path: 'order/order-details/:id',
        component: CheckoutComponent
      },
      {
        path: 'order/sendtoemail',
        component: SendOrderinfoEmailComponent
      },
      {
        path: 'allproducts/category/:name',
        component: AllProductsComponent
      }
    ]
  },
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'create-category',
        component: CreateCategoryComponent
      }
    ]
  },
  {
    path: 'seller',
    canActivate: [SellerGuard],
    children: [
      {
        path: '',
        component: SellerComponent,
      }, {
        path: 'dashboard',
        component: SellerDashboardComponent
      },
      {
        path: 'profile',
        component: SellerProfileComponent,
        pathMatch: 'full'
      },
      {
        path: 'inventory',
        component: SellerInventoryComponent
      },
      {
        path: 'analytics',
        component: SellerAnalyticsComponent
      },
      {
        path: 'add-images/:id',
        component: AddImagesComponent,
      }, {
        path: 'products-details',
        component: ProductsDetailsComponent,
      },
      {
        path: 'orders',
        component: SellerOrderComponent
      },
      {
        path: 'products',
        component: SellerProductsComponent
      },
      {
        path: 'product-info/:id',
        component: ProductInformationComponent,
      },
      {
        path: 'order/order-details/:id',
        component: SellerOrderInformationComponent
      },
      {
        path: 'edit-product/:id',
        component: SellerEditProductComponent
      }
    ]
  },
  {
    path: '**',
    component: ErrorComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
