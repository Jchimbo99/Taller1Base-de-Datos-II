import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosDisponiblesComponent } from './productos-disponibles.component';

describe('ProductosDisponiblesComponent', () => {
  let component: ProductosDisponiblesComponent;
  let fixture: ComponentFixture<ProductosDisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosDisponiblesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductosDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
