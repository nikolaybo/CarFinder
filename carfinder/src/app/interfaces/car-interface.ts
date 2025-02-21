export type Cars = {
  cars: Car[];
}

export interface Car {
  id: string;
  model: string;
  type: string;
  fuel_consumption: number;
  price: number;
  discounted_price: number;
  gearbox: string;
  image: string;
  seats: number;
  additional_info?: string[];
}
