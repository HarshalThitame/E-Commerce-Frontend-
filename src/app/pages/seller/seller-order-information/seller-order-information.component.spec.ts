import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerOrderInformationComponent } from './seller-order-information.component';

describe('SellerOrderInformationComponent', () => {
  let component: SellerOrderInformationComponent;
  let fixture: ComponentFixture<SellerOrderInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerOrderInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerOrderInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
