import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeProductComponent } from './fake-product.component';

describe('FakeProductComponent', () => {
  let component: FakeProductComponent;
  let fixture: ComponentFixture<FakeProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FakeProductComponent]
    });
    fixture = TestBed.createComponent(FakeProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
