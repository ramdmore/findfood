import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessOwnerDetailsService } from '../../../Shared/Services/mess-owner-details.service';
import { MyCloudImagesService } from '../../../Shared/Services/my-cloud-images.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface MenuItem {
  day: string;
  morningMenu: string[];
  eveningMenu: string[];
}


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  standalone: false,
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  MenuDetailsForm!: FormGroup;
  menuList: MenuItem[] = [
    { day: 'Monday', morningMenu: [], eveningMenu: [] },
    { day: 'Tuesday', morningMenu: [], eveningMenu: [] },
    { day: 'Wednesday', morningMenu: [], eveningMenu: [] },
    { day: 'Thursday', morningMenu: [], eveningMenu: [] },
    { day: 'Friday', morningMenu: [], eveningMenu: [] },
    { day: 'Saturday', morningMenu: [], eveningMenu: [] },
    { day: 'Sunday', morningMenu: [], eveningMenu: [] },
  ];

  constructor(
    private messDetailsServ: MessOwnerDetailsService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initializeMenuForm();
    this.getMenuDetails();
  }

  initializeMenuForm() {
    this.MenuDetailsForm = this.fb.group({
      menuDetails: this.fb.group({
        userId: localStorage.getItem('userId'),
        morning: this.fb.group(
          this.menuList.reduce((acc, day) => {
            acc[day.day] = this.fb.array([], Validators.required);
            return acc;
          }, {} as { [key: string]: FormArray })
        ),
        evening: this.fb.group(
          this.menuList.reduce((acc, day) => {
            acc[day.day] = this.fb.array([], Validators.required);
            return acc;
          }, {} as { [key: string]: FormArray })
        ),
      }),
    });
  }

  getFormArray(day: string, time: 'morning' | 'evening'): FormArray {
    return this.MenuDetailsForm.get(`menuDetails.${time}.${day}`) as FormArray;
  }

  showToFoodItem(day: string, time: 'morning' | 'evening', inputElement: HTMLInputElement) {
    const foodVal = inputElement.value.trim();
    if (!foodVal) return;

    const formArray = this.getFormArray(day, time);
    const menu = this.menuList.find(m => m.day === day);

    if (menu) {
      const menuItems = time === 'morning' ? menu.morningMenu : menu.eveningMenu;

      if (!menuItems.includes(foodVal)) {
        menuItems.push(foodVal);
        formArray.push(this.fb.control(foodVal));
      } else {
        // this.toastrServ.warning(`${foodVal} already added in ${time} menu.`);
      }
    }
    inputElement.value = '';
  }

  toggleFoodSelection(day: string, time: 'morning' | 'evening', foodItem: string, isChecked: boolean) {
    const formArray = this.getFormArray(day, time);
    const menu = this.menuList.find(item => item.day === day);

    if (menu) {
      if (isChecked) {
        if (!formArray.value.includes(foodItem)) {
          formArray.push(this.fb.control(foodItem));
        }
      } else {
        const index = formArray.controls.findIndex(control => control.value === foodItem);
        if (index > -1) {
          formArray.removeAt(index);
        }
      }
    }
  }

  isFoodSelected(day: string, time: 'morning' | 'evening', foodItem: string): boolean {
    return this.getFormArray(day, time).value.includes(foodItem);
  }

  getMenuDetails() {
    this.messDetailsServ.getMenuDetails().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.menuList.forEach(menu => {
            const morningArray = this.getFormArray(menu.day, 'morning');
            const eveningArray = this.getFormArray(menu.day, 'evening');
            morningArray.clear();
            eveningArray.clear();

            menu.morningMenu = response.data.morning[menu.day] || [];
            menu.eveningMenu = response.data.evening[menu.day] || [];

            menu.morningMenu.forEach(item => morningArray.push(this.fb.control(item)));
            menu.eveningMenu.forEach(item => eveningArray.push(this.fb.control(item)));
          });
        }
      },
      error: error => {
        console.error('Error fetching menu details:', error);
      }
    });
  }

  onMenuDetailsSubmit() {
    if (this.MenuDetailsForm.valid) {
      this.messDetailsServ.updateMenuDetails(this.MenuDetailsForm.value).subscribe({
        next: (res:any) => {
          console.log(res);
          
          this.snackBar.open('✅ Mess Details Updated successfully!', 'OK', {
            duration: 3000, // Auto-dismiss after 3 seconds
            horizontalPosition: 'right', // Positioned on the right
            verticalPosition: 'top', // Appears at the top
            panelClass: ['success-toast'] // Custom styling class
          });
        },
        error: (error:any) => {
          console.log(error);
          
          this.snackBar.open('❌ Update failed! Please try again.', 'OK', {
            duration: 3000, 
            horizontalPosition: 'right', 
            verticalPosition: 'top', 
            panelClass: ['error-toast'] // Custom error class
          });
        }
      });
    } else {
      // this.toastrServ.warning('Please select at least one item in each category');
    }
  }
}