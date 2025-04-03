import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessOwnerDetailsService } from '../../../Shared/Services/mess-owner-details.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-time',
  standalone: false,
  templateUrl: './time.component.html',
  styleUrl: './time.component.css'
})
export class TimeComponent implements OnInit {
  timeDetailsForm!: FormGroup; 
  timeData : any[]= [];

  daysOfWeek: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  constructor(private fb: FormBuilder, private httpService: MessOwnerDetailsService,private snackBar: MatSnackBar ) {}

  ngOnInit(): void {
   this.initializeForm();
   this.getTimeDetails();
   this.mySetValueDetails();
  }

  initializeForm(){
    this.timeDetailsForm = this.fb.group({
      timeDetails: this.fb.group({
        userId: [localStorage.getItem('userId')],
        morning: this.fb.group({
          from: ['', Validators.required],
          to: ['', Validators.required],
        }),
        evening: this.fb.group({
          from: ['', Validators.required],
          to: ['', Validators.required],
        }),
        holiday: this.fb.group({ 
          day: ['', Validators.required],
          period: ['fullDay'], 
        }),
      }),
    });
  }

  getTimeDetails(){
    this.httpService.getTimeDetails().subscribe({
      next:(_resp:any)=>{
        console.log('time response',_resp.data);
        this.timeData.push(_resp.data);
        this.mySetValueDetails();
      },
      error:(_err:any)=>{
        console.log(_err.message);
        
      }
    })
  }

  mySetValueDetails(){
    this.timeData.forEach((timeDetails: any) => {
      console.log(timeDetails);
      this.timeDetailsForm.get('timeDetails.morning.from')?.setValue(timeDetails.morning.from);
      this.timeDetailsForm.get('timeDetails.morning.to')?.setValue(timeDetails.morning.to);
      this.timeDetailsForm.get('timeDetails.evening.from')?.setValue(timeDetails.evening.from);
      this.timeDetailsForm.get('timeDetails.evening.to')?.setValue(timeDetails.evening.to);
      this.timeDetailsForm.get('timeDetails.holiday.day')?.setValue(timeDetails.holiday.day);
      this.timeDetailsForm.get('timeDetails.holiday.period')?.setValue(timeDetails.holiday.period);
    })
  }

  onSaveTimeDetails(){
    this.httpService.updateTimeDetails(this.timeDetailsForm.value).subscribe({
      next:(_resp:any)=>{
        console.log(_resp);
        this.snackBar.open('✅ Time Details updated successfully!', 'OK', {
          duration: 3000, // Auto-dismiss after 3 seconds
          horizontalPosition: 'right', // Positioned on the right
          verticalPosition: 'top', // Appears at the top
          panelClass: ['success-toast'] // Custom styling class
        });
        
      },
      error:(_err:any)=>{
        console.log(_err.message);
        this.snackBar.open('❌ Update failed! Please try again.', 'OK', {
          duration: 3000, 
          horizontalPosition: 'right', 
          verticalPosition: 'top', 
          panelClass: ['error-toast'] // Custom error class
        });
        
      }
    })
  }

}
