import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {EmailService} from "../../../../services/email.service";

@Component({
  selector: 'app-send-orderinfo-email',
  templateUrl: './send-orderinfo-email.component.html',
  styleUrls: ['./send-orderinfo-email.component.css']
})
export class SendOrderinfoEmailComponent implements OnInit,AfterViewInit {
  @ViewChild('content') content!: ElementRef;
  @Input() orderItems: any ={
    product:{},
    quantity:'',
  };
  @Input() payment: any;
  @Input() shippingAddress: any;
  @Input() user: any;

  htmlContent: string = '';

constructor(private emailService:EmailService) {
}
  ngOnInit() {
    // Initialization code if needed
  }
  ngAfterViewInit(): void {
    this.htmlContent = this.content.nativeElement.innerHTML;

  }

  sendOrderEmail() {
    // Logic to send email with the provided data
    console.log('Order Items:', this.orderItems);
    console.log('Payment:', this.payment);
    console.log('Shipping Address:', this.shippingAddress);
    console.log('User:', this.user);
    // Implement actual email sending logic here

      for (let i = 0; i < this.orderItems.length; i++) {
        this.orderItems[i].product.mainIamge = 'https://harshal-ecom.s3.eu-north-1.amazonaws.com/images/'+this.orderItems[i].product.images[0].url;
    }
    this.sendMail();
  }

  sendMail()
  {
    const emailData = {
      to: this.user.email,
      subject: 'Order Information',
      body: this.htmlContent // Use the content of the HTML file
    };

    this.emailService.sendOrderDetails(emailData).subscribe(data=>{
      console.log(data);
    })
  }


  calculateDiscountedPrice(price: number, discount: number): number {
    if (!price || !discount) {
      return price; // No discount or invalid price
    }
    const discountedPrice = price - (price * discount / 100);
    return discountedPrice;
  }

}
