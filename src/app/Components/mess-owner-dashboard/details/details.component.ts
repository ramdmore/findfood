import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessOwnerDetailsService } from '../../../Shared/Services/mess-owner-details.service';
import { MyCloudImagesService } from '../../../Shared/Services/my-cloud-images.service';
import { FoodTypeService } from '../../../Shared/Services/food-type.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-details',
  standalone: false,
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {
  detailForm!: FormGroup;
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  licenseImagePreview: string | null = null;
  messDetails: any = null;

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('licenseFileInput') licenseFileInput!: ElementRef;
  @ViewChild('deleteImageDialog') deleteImageDialog!: TemplateRef<any>;
  @ViewChild('deleteLicenseDialog') deleteLicenseDialog!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private httpService: MessOwnerDetailsService,
    private cloudServ: MyCloudImagesService,
    private foodType: FoodTypeService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getMessDetails();
  }

  initializeForm() {
    this.detailForm = this.fb.group({
      messDetails: this.fb.group({
        userId: [localStorage.getItem('userId')],
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
    });
  }

  onLicenseFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.licenseImagePreview = e.target.result;
    };
    reader.readAsDataURL(file);

    // Upload to cloud
    this.cloudServ.uploadImages(file).subscribe({
      next: (res: any) => {
        this.detailForm.get('messDetails.license.licenseImage')?.setValue(res);
        this.snackBar.open('License image uploaded successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-toast']
        });
      },
      error: (err) => {
        console.error('License image upload failed:', err);
        this.licenseImagePreview = null;
        this.snackBar.open('Failed to upload license image', 'Close', {
          duration: 3000,
          panelClass: ['error-toast']
        });
      },
    });
  }

  onFileChange(event: any): void {
    const files = Array.from(event.target.files || []) as File[];
    if (files.length === 0) return;

    files.forEach((file: File) => {
      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);

      // Upload to cloud
      this.cloudServ.uploadImages(file).subscribe({
        next: (res: any) => {
          const messImagesArray = this.detailForm.get('messDetails.messImages') as FormArray;
          messImagesArray.push(new FormControl(res));
          this.snackBar.open('Image uploaded successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-toast']
          });
        },
        error: (err) => {
          console.error('Error uploading image:', err);
          const index = this.imagePreviews.length - 1;
          if (index >= 0) {
            this.imagePreviews.splice(index, 1);
          }
          this.snackBar.open('Failed to upload image', 'Close', {
            duration: 3000,
            panelClass: ['error-toast']
          });
        },
      });
    });

    this.selectedFiles = [...this.selectedFiles, ...files];
    event.target.value = '';
  }

  confirmImageDelete(index: number): void {
    const dialogRef = this.dialog.open(this.deleteImageDialog, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeImage(index);
        this.snackBar.open('Image deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-toast']
        });
      }
    });
  }

  confirmLicenseDelete(): void {
    const dialogRef = this.dialog.open(this.deleteLicenseDialog, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeLicenseImage();
        this.snackBar.open('License image deleted successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-toast']
        });
      }
    });
  }

  removeLicenseImage(): void {
    this.licenseImagePreview = null;
    this.detailForm.get('messDetails.license.licenseImage')?.setValue(null);
    if (this.licenseFileInput) {
      this.licenseFileInput.nativeElement.value = '';
    }
  }

  removeImage(index: number): void {
    const messImagesArray = this.detailForm.get('messDetails.messImages') as FormArray;
    if (messImagesArray.length > index) {
      messImagesArray.removeAt(index);
    }
    this.imagePreviews.splice(index, 1);
    if (this.selectedFiles.length > index) {
      this.selectedFiles.splice(index, 1);
    }
  }

  resetFileInput(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
      this.selectedFiles = [];
    }
  }

  getSelectedFileNames(): string {
    return this.selectedFiles.length > 0
      ? this.selectedFiles.map(file => file.name).join(', ')
      : 'Choose file or drop here';
  }

  getMessDetails() {
    this.httpService.getMessDetails().subscribe({
      next: (response: any) => {
        if (response.data) {
          this.messDetails = response.data;
          this.setMessDetails(response.data);
        }
      },
      error: (error: any) => {
        console.error('Error fetching mess details:', error);
        this.snackBar.open('Failed to load mess details', 'Close', {
          duration: 3000,
          panelClass: ['error-toast']
        });
      }
    });
  }

  setMessDetails(data: any) {
    if (!data) return;

    const messDetailsGroup = this.detailForm.get('messDetails');
    if (!messDetailsGroup) return;

    // Set basic fields
    messDetailsGroup.patchValue({
      messName: data.messName,
      foodType: data.foodType,
    });

    // Set address
    if (data.address) {
      messDetailsGroup.get('address')?.patchValue({
        shopNumber: data.address.shopNumber,
        area: data.address.area,
        city: data.address.city,
        pincode: data.address.pincode,
        landmark: data.address.landmark,
      });
    }

    // Set contact
    if (data.contact) {
      messDetailsGroup.get('contact')?.patchValue({
        mobileNumber: data.contact.mobileNumber,
        email: data.contact.email,
      });
    }

    // Set license
    if (data.license) {
      messDetailsGroup.get('license')?.patchValue({
        licenseNumber: data.license.licenseNumber,
        licenseImage: data.license.licenseImage,
      });

      // Set license preview if image exists
      if (data.license.licenseImage) {
        this.licenseImagePreview = data.license.licenseImage;
      }
    }

    // Set mess images
    if (data.messImages && Array.isArray(data.messImages)) {
      const messImagesArray = messDetailsGroup.get('messImages') as FormArray;
      messImagesArray.clear(); // Clear existing images

      data.messImages.forEach((imageUrl: string) => {
        messImagesArray.push(new FormControl(imageUrl));
        this.imagePreviews.push(imageUrl);
      });
    }
  }

  showToVegAndToVegNonVeg(type: string) {
    this.foodType.updateFoodType(type);
  }

  saveMessDetails() {
    if (this.detailForm.invalid) {
      this.snackBar.open('Please fill all required fields', 'Close', {
        duration: 3000,
        panelClass: ['error-toast']
      });
      return;
    }

    this.httpService.updateMessDetails(this.detailForm.value).subscribe({
      next: (_resp: any) => {
        this.snackBar.open('✅ Mess Details Updated successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-toast']
        });
      },
      error: (_err: any) => {
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