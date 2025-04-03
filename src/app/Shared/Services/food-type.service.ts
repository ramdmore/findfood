import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodTypeService {
  private readonly FOOD_TYPE_KEY = 'foodType';
  private foodTypeSubject = new BehaviorSubject<string>(this.getStoredFoodType());
  foodType$ = this.foodTypeSubject.asObservable();

  constructor() {}

  private getStoredFoodType(): string {
    return localStorage.getItem(this.FOOD_TYPE_KEY) || 'Veg';
  }

  updateFoodType(type: string): void {
    localStorage.setItem(this.FOOD_TYPE_KEY, type);
    this.foodTypeSubject.next(type);
  }

  getCurrentFoodType(): string {
    return this.foodTypeSubject.value;
  }
}