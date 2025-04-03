import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { CredentialsService } from '../../Shared/Services/credentials.service';
import { MyCloudImagesService } from '../../Shared/Services/my-cloud-images.service';
import { MessOwnerDetailsService } from '../../Shared/Services/mess-owner-details.service';
import { HttpClient } from '@angular/common/http';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-mess-detail-form',
  standalone: false,
  templateUrl: './mess-detail-form.component.html',
  styleUrl: './mess-detail-form.component.css'
})
export class MessDetailFormComponent implements OnInit,AfterViewInit {
  constructor(private fb: FormBuilder, private loginServ: CredentialsService, private cloudServ: MyCloudImagesService, private messServ: MessOwnerDetailsService,private http:HttpClient,public dialog: MatDialog, private router : Router, private snackBar: MatSnackBar) {}

  messDetailsForm: FormGroup |any;

  @ViewChild('messname') messname!: ElementRef;

  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  licenseImagePreview: string | null = null;
  
  expandedDay = 'Monday';
  newMenuItems: { [key: string]: string } = {
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: '',
  };

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('licenseFileInput') licenseFileInput!: ElementRef;
  
  daysOfWeek: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  menuOptions: string[] = ['chapati', 'daal', 'rice', 'papad'];
  menuDetails: {
    morning: { [key: string]: string[] };
    evening: { [key: string]: string[] };
  } = {
    morning: {
      Monday: ['chapati', 'dal', 'rice','curd'],
      Tuesday: ['chapati', 'dal', 'rice'],
      Wednesday: ['chapati', 'dal', 'rice'],
      Thursday: ['chapati', 'dal', 'rice'],
      Friday: ['chapati', 'dal', 'rice'],
      Saturday: ['chapati', 'dal', 'rice'],
      Sunday: ['chapati', 'dal', 'rice'],
    },
    evening: {
      Monday: ['chapati', 'dal', 'rice'],
      Tuesday: ['chapati', 'dal', 'rice'],
      Wednesday: ['chapati', 'dal', 'rice'],
      Thursday: ['chapati', 'dal', 'rice'],
      Friday: ['chapati', 'dal', 'rice'],
      Saturday: ['chapati', 'dal', 'rice'],
      Sunday: ['chapati', 'dal', 'rice'],
    },
  };

  meals: boolean = true;

  ngOnInit(): void {
    this.messDetailsForm = this.initializeForm();
    this.initializeMenuControls();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.messname.nativeElement.focus();
    }, 0);
  }

  initializeForm(): FormGroup {
    return this.fb.group({
      messDetails: this.fb.group({
        userId: localStorage.getItem('userId'),
        messName: ['', Validators.required],
        address: this.fb.group({
          shopNumber: ['', Validators.required],
          area: ['', Validators.required],
          city: ['', Validators.required],
          pincode: ['', Validators.required],
          landmark: ['', Validators.required],
        }),
        contact: this.fb.group({
          mobileNumber: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
        }),
        license: this.fb.group({
          licenseNumber: ['', Validators.required],
          licenseImage: [null],
        }),
        foodType: ['veg', Validators.required],
        messImages: this.fb.array([]),
      }),
      menuDetails: this.fb.group({
        userId: localStorage.getItem('userId'),
        morning: this.fb.group({}),
        evening: this.fb.group({}),
      }),
      priceDetails: this.fb.group({
        userId: localStorage.getItem('userId'),
        monthlyCharges: ['', Validators.required],
        singleDayCharges: [''],
        specialDayVegCharges: [''],
        specialDaynonVegCharges: [''],
      }),
      timeDetails: this.fb.group({
        userId: localStorage.getItem('userId'),
        morning: this.fb.group({
          from: ['', Validators.required],
          to: ['', Validators.required],
        }),
        evening: this.fb.group({
          from: ['', Validators.required],
          to: ['', Validators.required],
        }),
        holiday: this.fb.group({
          day: [''],
          period: [''],
        }),
      }),
    });
  }

  onLicenseFileChange(event: any): void {
    const file = event.target.files[0];
  
    if (!file) return; 
    console.log('Selected file:', file);
  
    this.cloudServ.uploadImages(file).subscribe({
      next: (res: any) => {
        console.log('Upload response:', res);
        
        this.messDetailsForm.get('messDetails.license.licenseImage')?.setValue(res);
      },
      error: (err) => {
        console.error('Image upload failed:', err);
      },
    });
  
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.licenseImagePreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
        reader.readAsDataURL(file);
  
        this.cloudServ.uploadImages(file).subscribe({
          next: (res: any) => {
            const imageUrl = res;
  
            const messImagesArray = this.messDetailsForm.get('messDetails.messImages') as FormArray;
            messImagesArray.push(new FormControl(imageUrl));
          },
          error: (err) => {
            console.error('Error uploading image:', err);
          },
        });
      });
  
      input.value = '';
    }
  }

  reset(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  getSelectedFileNames(): string {
    return this.selectedFiles.length > 0
      ? this.selectedFiles.map((file) => file.name).join(', ')
      : 'Choose file or drop here';
  }

  initializeMenuControls(): void {
    this.daysOfWeek.forEach((day) => {
      (this.messDetailsForm.get('menuDetails.morning') as FormGroup).addControl(
        day,
        this.fb.control([])
      );
      (this.messDetailsForm.get('menuDetails.evening') as FormGroup).addControl(
        day,
        this.fb.control([])
      );
    });

    Object.entries(this.menuDetails.morning).forEach(([day, items]) => {
      const control = this.messDetailsForm.get(`menuDetails.morning.${day}`);
      if (control) {
        control.setValue(items);
      }
    });

    Object.entries(this.menuDetails.evening).forEach(([day, items]) => {
      const control = this.messDetailsForm.get(`menuDetails.evening.${day}`);
      if (control) {
        control.setValue(items);
      }
    });
  }

  changeMeals(): void {
    this.meals = !this.meals;
  }

  isPanelExpanded(day: string): boolean {
    return day === this.expandedDay;
  }

  updateMenu(
    day: string,
    item: string,
    mealType: 'morning' | 'evening',
    event: Event
  ): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.menuDetails[mealType][day].push(item);
    } else {
      this.menuDetails[mealType][day] = this.menuDetails[mealType][day].filter(
        (i) => i !== item
      );
    }

    const menuControl = this.messDetailsForm.get(
      `menuDetails.${mealType}.${day}`
    );
    if (menuControl) {
      menuControl.setValue(this.menuDetails[mealType][day]);
    }
  }

  addMeal(day: string, mealType: 'morning' | 'evening'): void {
    const newMeal = this.newMenuItems[day.toLowerCase()].trim();
    if (newMeal && !this.menuOptions.includes(newMeal)) {
      this.menuOptions.push(newMeal);
      this.menuDetails[mealType][day].push(newMeal);

      const menuControl = this.messDetailsForm.get(
        `menuDetails.${mealType}.${day}`
      );
      if (menuControl) {
        menuControl.setValue(this.menuDetails[mealType][day]);
      }

      this.newMenuItems[day.toLowerCase()] = '';
    }
  }

  onSubmit(): void {

    console.log(this.messDetailsForm.value);
    
    this.messServ.postMessDetails(this.messDetailsForm.value).subscribe({
      next: (res:any) => {
        console.log(res);
        
        this.snackBar.open('✅ Mess Details Updated successfully!', 'OK', {
          duration: 3000, // Auto-dismiss after 3 seconds
          horizontalPosition: 'right', // Positioned on the right
          verticalPosition: 'top', // Appears at the top
          panelClass: ['success-toast'] // Custom styling class
        });

        this.router.navigate(['/login']);
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
    })
  
    // this.http.post('https://findfood-ashen.vercel.app/api/user/messData',this.messDetailsForm.value).subscribe({
    //   next:(res:any)=>console.log(res),
    //   error:(err)=>console.log(err)
      
      

    // if (this.messDetailsForm.valid) {
    //  this.messServ.postMessDetails(this.messDetailsForm.value).subscribe(
    //   {
    //     next:(res:any)=>{
    //       console.log(res)
    //       this.messDetailsForm.reset()
    //     },
    //     error:(err:any)=>console.log(err)
    //   }
    //  )
    // }
  }
  moveToNextSlide(first:any,stepper:any){
    first.completed=true
    stepper.next()
  }
  isOptional: boolean = false;
  isEditable: boolean = false;

  removeImage(index: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      data: { imageIndex: index }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.imagePreviews.splice(index, 1);
      }
    });
  }

  get morningFrom(): string {
    return this.messDetailsForm.get('timeDetails.morning.from')?.value || '';
  }
  
  get morningTo(): string {
    return this.messDetailsForm.get('timeDetails.morning.to')?.value || '';
  }
  
  get eveningFrom(): string {
    return this.messDetailsForm.get('timeDetails.evening.from')?.value || '';
  }
  
  get eveningTo(): string {
    return this.messDetailsForm.get('timeDetails.evening.to')?.value || '';
  }
  

}





