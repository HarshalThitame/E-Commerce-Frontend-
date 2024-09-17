import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerInventoryComponent } from './seller-inventory.component';

describe('SellerInventoryComponent', () => {
  let component: SellerInventoryComponent;
  let fixture: ComponentFixture<SellerInventoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerInventoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
