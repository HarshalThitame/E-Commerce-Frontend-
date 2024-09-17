import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerSidenavComponent } from './seller-sidenav.component';

describe('SellerSidenavComponent', () => {
  let component: SellerSidenavComponent;
  let fixture: ComponentFixture<SellerSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SellerSidenavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
