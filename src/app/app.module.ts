import {NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {FooterComponent} from './components/footer/footer.component';
import {HomeComponent} from './pages/home/home.component';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {MatButton, MatIconButton} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_ERROR, MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import { LoginComponent } from './components/login/login.component';
import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient} from "@angular/common/http";
import { UserdashboardComponent } from './pages/userdashboard/userdashboard.component';
import {AuthInterceptor, authInterceptorProviders} from "./guards/auth.interceptor";
import { CategoryComponent } from './pages/admin/category/category.component';
import { CreateCategoryComponent } from './pages/admin/create-category/create-category.component';
import {AdminDashboardComponent} from "./pages/admin/admin-dashboard/admin-dashboard.component";
import { SellerComponent } from './pages/seller/seller.component';
import {
  MatCard, MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardImage,
  MatCardTitle
} from "@angular/material/card";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import {MatDivider} from "@angular/material/divider";
import { CartComponent } from './pages/cart/cart.component';
import { AddImagesComponent } from './pages/seller/add-images/add-images.component';
import { SellerNavbarComponent } from './components/navbar/seller-navbar/seller-navbar.component';
import { ProductsDetailsComponent } from './pages/seller/products-details/products-details.component';
import {MatLine, MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import { CheckoutComponent } from './components/order/checkout/checkout.component';
import { AddressFormComponent } from './components/order/address-form/address-form.component';
import { PaymentMethodsComponent } from './components/order/payment-methods/payment-methods.component';
import { OrderSummaryComponent } from './components/order/order-summary/order-summary.component';
import { SavedAddressesComponent } from './components/order/saved-addresses/saved-addresses.component';
import { AllProductsComponent } from './pages/all-products/all-products.component';
import {NgxPaginationModule} from "ngx-pagination";
import { ErrorComponent } from './components/error/error.component';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { OrderInformationComponent } from './pages/my-orders/order-information/order-information.component';
import { SellerDashboardComponent } from './pages/seller/seller-dashboard/seller-dashboard.component';
import { SellerOrderComponent } from './pages/seller/seller-order/seller-order.component';
import { SellerSidenavComponent } from './pages/seller/seller-sidenav/seller-sidenav.component';
import { SellerProductsComponent } from './pages/seller/seller-products/seller-products.component';
import { SellerOrderInformationComponent } from './pages/seller/seller-order-information/seller-order-information.component';
import { SellerEditProductComponent } from './pages/seller/seller-edit-product/seller-edit-product.component';
import { MyProfileComponent } from './pages/my-profile/my-profile.component';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import { SidebarComponent } from './pages/my-profile/sidebar/sidebar.component';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatList, MatListItem, MatNavList} from "@angular/material/list";
import { PersonalInfoComponent } from './pages/my-profile/personal-info/personal-info.component';
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import { ManageAddressesComponent } from './pages/my-profile/manage-addresses/manage-addresses.component';
import { AddressDialogComponent } from './pages/my-profile/manage-addresses/address-dialog/address-dialog.component';
import {MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import { AllSuggestedProductsComponent } from './pages/home/all-suggested-products/all-suggested-products.component';
import {
  AlertDialogComponent,
  ProductInformationComponent
} from './pages/seller/product-information/product-information.component';
import { AllOrdersComponent } from './pages/my-orders/all-orders/all-orders.component';
import { WishlistComponent } from './pages/my-orders/wishlist/wishlist.component';
import {MatTooltip, TooltipComponent} from "@angular/material/tooltip";
import {NgOptimizedImage} from "@angular/common";
import { SellerProfileComponent } from './pages/seller/seller-profile/seller-profile.component';
import { CategoriesNavbarComponent } from './components/navbar/categories-navbar/categories-navbar.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/login-page/signup-page/signup-page.component';
import { ImageDialogComponent } from './pages/product-detail/image-dialog/image-dialog.component';
import {MatSlider} from "@angular/material/slider";
import { ForgotPasswordComponent } from './components/login-page/forgot-password/forgot-password.component';
import { SendOrderinfoEmailComponent } from './components/order/checkout/send-orderinfo-email/send-orderinfo-email.component';
import { SellerInventoryComponent } from './pages/seller/seller-inventory/seller-inventory.component';
import { SellerAnalyticsComponent } from './pages/seller/seller-analytics/seller-analytics.component';
import { SellerOrderNotificationComponent } from './components/navbar/seller-navbar/seller-order-notification/seller-order-notification.component';
import {ToastrModule} from "ngx-toastr";
import {MatToolbar} from "@angular/material/toolbar";


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    UserdashboardComponent,
    AdminDashboardComponent,
    CategoryComponent,
    CreateCategoryComponent,
    SellerComponent,
    ProductDetailComponent,
    CartComponent,
    AddImagesComponent,
    SellerNavbarComponent,
    ProductsDetailsComponent,
    CheckoutComponent,
    AddressFormComponent,
    PaymentMethodsComponent,
    OrderSummaryComponent,
    SavedAddressesComponent,
    AllProductsComponent,
    ErrorComponent,
    MyOrdersComponent,
    OrderInformationComponent,
    SellerDashboardComponent,
    SellerOrderComponent,
    SellerSidenavComponent,
    SellerProductsComponent,
    SellerOrderInformationComponent,
    SellerEditProductComponent,
    MyProfileComponent,
    SidebarComponent,
    PersonalInfoComponent,
    ManageAddressesComponent,
    AddressDialogComponent,
    AllSuggestedProductsComponent,
    ProductInformationComponent,
    AlertDialogComponent,
    AllOrdersComponent,
    WishlistComponent,
    SellerProfileComponent,
    CategoriesNavbarComponent,
    LoginPageComponent,
    SignupPageComponent,
    ImageDialogComponent,
    ForgotPasswordComponent,
    SendOrderinfoEmailComponent,
    SellerInventoryComponent,
    SellerAnalyticsComponent,
    SellerOrderNotificationComponent,


  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        MatMenu,
        MatMenuItem,
        MatButton,
        MatMenuTrigger,
        FormsModule,
        MatFormField,
        MatIcon,
        MatIconButton,
        MatInput,
        MatLabel,
        MatHint,
        ReactiveFormsModule,
        MatError,
        MatCard,
        MatCardHeader,
        MatGridList,
        MatGridTile,
        MatCardContent,
        MatCardFooter,
        MatCardTitle,
        MatCardImage,
        MatDivider,
        NgxUiLoaderHttpModule.forRoot({
            showForeground: true,
        }),
        NgxUiLoaderModule,
        MatOption,
        MatSelect,
        NgxPaginationModule,
        MatTabGroup,
        MatTab,
        MatSidenavContent,
        MatSidenavContainer,
        MatNavList,
        MatListItem,
        MatRadioGroup,
        MatRadioButton,
        MatSidenav,
        MatExpansionPanel,
        MatExpansionPanelTitle,
        MatExpansionPanelHeader,
        MatList,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatLine,
        MatCardActions,
        TooltipComponent,
        MatTooltip,
        NgOptimizedImage,
        MatSlider,
        ToastrModule.forRoot(),
        MatToolbar,
        // Add ToastrModule with default configuration

    ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(),
    authInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
