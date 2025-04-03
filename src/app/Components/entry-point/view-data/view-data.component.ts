import { Component, OnInit } from '@angular/core';
import { FeedbackComponent } from '../../feedback/feedback.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { CustomerService } from '../../../Shared/Services/customer.service';

@Component({
  selector: 'app-view-data',
  standalone: false,
  templateUrl: './view-data.component.html',
  styleUrl: './view-data.component.css'
})
export class ViewDataComponent implements OnInit {
   // rating: number = 4.1;
   totalRatings: number = 0;
   isOpen: boolean = false;
   messStatusText: string = ''
   closingTime: string = "10:30 PM";
 
   myUserId: string = '';
   messInfo: any;
   feedbackText: string = '';
   buttonWidth: string = '';
 
   myRatingData: any[] = [];
   star: string = '0';
   myMessOnwerName: string = '';
 
   private statusUpdateInterval: any;
 
   constructor(private activatedRoute: ActivatedRoute, private MessService: CustomerService, public dialog: MatDialog) { }
 
 
   ngOnInit(): void {
     this.activatedRoute.params.pipe(
       switchMap((params: any) => {
         this.myUserId = params.userId;
         localStorage.setItem('customerUserId', this.myUserId);
         return this.MessService.getMessDetailsForCustomer();
       })
     ).subscribe((data: any) => {
       console.log(data);
       this.messInfo = data.messDetails.find((messData: any) => messData.userId === this.myUserId);
       this.myMessOnwerName = this.messInfo.messName;
       console.log(this.messInfo);
 
       // ✅ Update the mess status after fetching details
       this.updateMessStatus();
     });
 
     this.refreshRatingData();
   }
 
 
 
  //  openFeedback() {
  //    const dialogRef = this.dialog.open(FeedbackComponent, {
  //      width: '800px', height: '400px',
  //      position: {
  //        right: '420px', top: '120px'
  //      },
  //      data: { name: this.myMessOnwerName, messOwnerUserId: this.myUserId },
  //      panelClass: 'filter-dialog'
  //    });
  //    dialogRef.afterClosed().subscribe((result: boolean) => {
  //      console.log(result);
  //      if (result) {
  //        this.refreshRatingData();
  //      }
  //    })
  //  }
 
   refreshRatingData() {
     this.MessService.getMessDetailsForCustomer().subscribe((data: any) => {
       if (data?.rating) {
         this.myRatingData = data.rating;
         const ratings = this.myRatingData
           .filter((customerRating: any) => customerRating.messUserId === this.myUserId)
           .map((userRating: any) => userRating.rating);
 
         this.totalRatings = ratings.length;
 
         if (this.totalRatings > 0) {
           const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
           const averageRating = totalRating / this.totalRatings;
           this.star = averageRating.toFixed(1);
         } else {
           this.star = '0';
         }
       }
     });
   }
 
 
   updateMessStatus() {
     if (!this.messInfo || !this.messInfo.timings) {
       this.isOpen = false;
       this.messStatusText = "Temporarily Closed";
       return;
     }
 
     const morningOpenStr = this.messInfo.timings.morning?.from;  // e.g., "07:00 AM"
     const morningCloseStr = this.messInfo.timings.morning?.to;    // e.g., "10:30 AM"
     const eveningOpenStr = this.messInfo.timings.evening?.from;  // e.g., "06:00 PM"
     const eveningCloseStr = this.messInfo.timings.evening?.to;   // e.g., "10:30 PM"
 
     const now = new Date();
     const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes
 
     const morningOpen = morningOpenStr ? this.convertTimeToMinutes(morningOpenStr) : null;
     const morningClose = morningCloseStr ? this.convertTimeToMinutes(morningCloseStr) : null;
     const eveningOpen = eveningOpenStr ? this.convertTimeToMinutes(eveningOpenStr) : null;
     const eveningClose = eveningCloseStr ? this.convertTimeToMinutes(eveningCloseStr) : null;
 
     const isMorningOpen = morningOpen !== null && morningClose !== null && currentTime >= morningOpen && currentTime < morningClose;
     const isEveningOpen = eveningOpen !== null && eveningClose !== null && currentTime >= eveningOpen && currentTime < eveningClose;
 
     const closingSoonThreshold = 30; // 30 minutes before closing
     const openingSoonThreshold = 30; // 30 minutes before opening
 
     if (isMorningOpen || isEveningOpen) {
       if ((morningClose !== null && morningClose - currentTime > 0 && morningClose - currentTime <= closingSoonThreshold) ||
         (eveningClose !== null && eveningClose - currentTime > 0 && eveningClose - currentTime <= closingSoonThreshold)) {
         this.isOpen = true;
         this.messStatusText = "Closing Soon";
       } else {
         this.isOpen = true;
         this.messStatusText = "Open";
       }
       return;
     }
 
     const nextOpeningTime = (morningOpen !== null && currentTime < morningOpen) ? morningOpen :
       (eveningOpen !== null && currentTime < eveningOpen) ? eveningOpen : null;
 
     if (nextOpeningTime !== null && nextOpeningTime - currentTime <= openingSoonThreshold) {
       this.isOpen = false;
       this.messStatusText = `Opening Soon at ${this.formatTime(nextOpeningTime)}`;
       return;
     }
 
     this.isOpen = false;
     this.messStatusText = "Closed";
   }
 
 
   private convertTimeToMinutes(time?: string): number {
     if (!time) return null as any;
     const [timePart, modifier] = time.split(" ");
     let [hours, minutes] = timePart.split(":").map(Number);
 
     if (modifier === "PM" && hours !== 12) {
       hours += 12;
     }
     if (modifier === "AM" && hours === 12) {
       hours = 0;
     }
 
     return hours * 60 + minutes; // Convert to minutes
   }
 
   private formatTime(timeInMinutes: number): string {
     const hours = Math.floor(timeInMinutes / 60);
     const minutes = timeInMinutes % 60;
     const period = hours >= 12 ? "PM" : "AM";
     const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
     const formattedMinutes = minutes.toString().padStart(2, "0");
 
     return `${formattedHours}:${formattedMinutes} ${period}`;
   }

}
