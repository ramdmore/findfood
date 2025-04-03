import { Component, Inject } from '@angular/core';
import { CustomerService } from '../../Shared/Services/customer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-feedback',
  standalone: false,
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent {
  rating: number = 0;  // Stores the selected rating
  tempRating: number = 0; // Temporary rating for hover effect
  starArray = [1, 2, 3, 4, 5];
  feedback: string = '';
  myCustomerUserId: any;
  myUserId: any;
  myMessName:string = '';
  myOwnerUserId: any;

  constructor(private customerServ:CustomerService,private dialogRef:MatDialogRef<any>,@Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar ) { }

  ngOnInit(): void {
    this.myCustomerUserId = localStorage.getItem('customerUserId');
    this.myUserId = localStorage.getItem('userId');
    // console.log('customer User Id >>>', this.myCustomerUserId);
    console.log(this.data);
    this.myMessName = this.data.name;
    this.myOwnerUserId = this.data.messOwnerUserId;
    console.log(this.myMessName);
    console.log(this.myOwnerUserId)
  }


  resetHover() {
    this.tempRating = this.rating; // Reset to stored rating
  }


  onRating(myStar: any) {
    // console.log(myStar);
    this.rating = myStar;
    // console.log(this.rating);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onSubmitFeedback() {
    const payLoad = {
      customerUserId: this.myUserId,
      messUserId:  this.myOwnerUserId,
      rating: this.rating,
      feedback: this.feedback
    }
    console.log(payLoad);
    this.customerServ.postFeedback(payLoad).subscribe({
      next:(_resp:any)=>{
        console.log(_resp);
        this.dialogRef.close(true);
        this.snackBar.open('✅ Your valuable Feedback submitted successfully!', 'OK', {
          duration: 3000, 
          horizontalPosition: 'right', 
          verticalPosition: 'top',
          panelClass: ['success-toast'] 
        });
      },
      error:(_err:any)=>{
        console.log(_err);
        this.dialogRef.close(false);
        this.snackBar.open('❌ Your Feedback is Not Submitted! Please try again.', 'OK', {
          duration: 3000, 
          horizontalPosition: 'right', 
          verticalPosition: 'top', 
          panelClass: ['error-toast']
        });

      }
    });
  }


}
