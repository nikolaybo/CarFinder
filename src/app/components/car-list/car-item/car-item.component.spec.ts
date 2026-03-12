import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CarItemComponent } from './car-item.component';
import type { Car } from '../../../interfaces/car-interface';

const mockCar: Car = {
  id: '1',
  model: 'Model S',
  type: 'Sedan',
  fuel_consumption: 7,
  price: 99,
  discounted_price: 0,
  gearbox: 'Auto',
  image: '',
  seats: 5,
};

describe('CarItemComponent', () => {
  let component: CarItemComponent;
  let fixture: ComponentFixture<CarItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarItemComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CarItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('car', mockCar);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
