import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSuggestedProductsComponent } from './all-suggested-products.component';

describe('AllSuggestedProductsComponent', () => {
  let component: AllSuggestedProductsComponent;
  let fixture: ComponentFixture<AllSuggestedProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllSuggestedProductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSuggestedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
