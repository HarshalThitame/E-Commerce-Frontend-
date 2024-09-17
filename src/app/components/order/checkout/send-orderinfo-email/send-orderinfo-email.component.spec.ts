import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendOrderinfoEmailComponent } from './send-orderinfo-email.component';

describe('SendOrderinfoEmailComponent', () => {
  let component: SendOrderinfoEmailComponent;
  let fixture: ComponentFixture<SendOrderinfoEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendOrderinfoEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendOrderinfoEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
