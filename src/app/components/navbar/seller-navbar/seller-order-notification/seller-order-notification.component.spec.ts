import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerOrderNotificationComponent } from './seller-order-notification.component';

describe('SellerOrderNotificationComponent', () => {
  let component: SellerOrderNotificationComponent;
  let fixture: ComponentFixture<SellerOrderNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerOrderNotificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerOrderNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
