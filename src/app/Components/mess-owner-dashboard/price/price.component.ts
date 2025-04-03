import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessOwnerDetailsService } from '../../../Shared/Services/mess-owner-details.service';
import { FoodTypeService } from '../../../Shared/Services/food-type.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-price',
  standalone: false,
  templateUrl: './price.component.html',
  styleUrl: './price.component.css'
})
export class PriceComponent implements OnInit, OnDestroy {
  priceDetailsForm!: FormGroup;
  PriceData: any[] = [];
  showNonVegCharges: boolean = false;
  private foodTypeSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private httpService: MessOwnerDetailsService,
    private foodType: FoodTypeService,
    private snackBar: MatSnackBar
  ) {
    // Initialize showNonVegCharges based on current food type
    this.showNonVegCharges = this.foodType.getCurrentFoodType() === 'Veg Or Non-Veg';
  }

  ngOnInit(): void {
    this.initializePriceDetailsForm();
    this.setupFoodTypeSubscription();
    this.getPriceDetails();
  }

  ngOnDestroy(): void {
    if (this.foodTypeSubscription) {
      this.foodTypeSubscription.unsubscribe();
    }
  }

  private setupFoodTypeSubscription(): void {
    this.foodTypeSubscription = this.foodType.foodType$.subscribe({
      next: (foodType: string) => {
        this.showNonVegCharges = foodType === 'Veg Or Non-Veg';
        this.updateNonVegValidation();
      },
      error: (error) => {
        console.error('Food type subscription error:', error);
        this.snackBar.open('Error updating food type preferences', 'Close', {
          duration: 3000,
          panelClass: ['error-toast']
        });
      }
    });
  }

  private updateNonVegValidation(): void {
    const nonVegControl = this.priceDetailsForm.get('priceDetails.specialDaynonVegCharges');
    if (!nonVegControl) return;

    if (this.showNonVegCharges) {
      nonVegControl.setValidators([Validators.required, Validators.min(0)]);
    } else {
      nonVegControl.clearValidators();
      nonVegControl.setValue(null);
    }
    nonVegControl.updateValueAndValidity();
  }

  initializePriceDetailsForm(): void {
    this.priceDetailsForm = this.fb.group({
      priceDetails: this.fb.group({
        userId: [localStorage.getItem('userId')],
        monthlyCharges: ['', [Validators.required, Validators.min(0)]],
        singleDayCharges: ['', [Validators.required, Validators.min(0)]],
        specialDayVegCharges: ['', [Validators.required, Validators.min(0)]],
        specialDaynonVegCharges: [null]
      })
    });

    // Set initial validation state for non-veg charges
    if (this.showNonVegCharges) {
      const nonVegControl = this.priceDetailsForm.get('priceDetails.specialDaynonVegCharges');
      if (nonVegControl) {
        nonVegControl.setValidators([Validators.required, Validators.min(0)]);
        nonVegControl.updateValueAndValidity();
      }
    }
  }

  getPriceDetails(): void {
    this.httpService.getPriceDetails().subscribe({
      next: (response: any) => {
        if (response?.data) {
          this.PriceData = [response.data];
          this.updateFormWithPriceData(response.data);
        }
      },
      error: (error) => {
        console.error('Error fetching price details:', error);
        this.snackBar.open('Failed to load price details', 'Close', {
          duration: 3000,
          panelClass: ['error-toast']
        });
      }
    });
  }

  private updateFormWithPriceData(priceData: any): void {
    if (!priceData) return;

    this.priceDetailsForm.patchValue({
      priceDetails: {
        monthlyCharges: priceData.monthlyCharges,
        singleDayCharges: priceData.singleDayCharges,
        specialDayVegCharges: priceData.specialDayVegCharges,
        specialDaynonVegCharges: priceData.specialDaynonVegCharges
      }
    });
  }

  savePriceDetails(): void {
    if (this.priceDetailsForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['error-toast']
      });
      return;
    }

    this.httpService.updatePriceDetails(this.priceDetailsForm.value).subscribe({
      next: (response) => {
        this.snackBar.open('✅ Price Details Updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-toast']
        });
      },
      error: (error) => {
        console.error('Error updating price details:', error);
        this.snackBar.open('❌ Update failed! Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-toast']
        });
      }
    });
  }
}