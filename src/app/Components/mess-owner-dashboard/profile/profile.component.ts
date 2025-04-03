import { Component } from '@angular/core';
import { RatingChartsService } from '../../../Shared/Services/rating-charts.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  myFeedBack:any[] = [];
  constructor(private ratingChartshttp:RatingChartsService){}
  ngOnInit(): void {
    this.getRatingDetails();
  }

  getRatingDetails(){
    this.ratingChartshttp.getRatingChartData().subscribe({
      next:(_ratingData:any)=>{
        console.log("_ratingData >>>",_ratingData);
        console.log("_ratingData >>>",_ratingData.data);
        this.myFeedBack = _ratingData.data;
      },
      error:(_error:any)=>{
        console.log("_error >>>",_error);
      }
    })
  }

  getStars(rating: number): boolean[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(true); // full star
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(false); // half star (we'll style this differently)
      } else {
        stars.push(false); // empty star
      }
    }
    return stars;
  }

  //  // Add this method to fix the error
  //  getRatingColor(rating: number): string {
  //   if (rating >= 4) return 'primary';  // Good rating (blue)
  //   if (rating >= 3) return 'accent';   // Average rating (pink)
  //   return 'warn';                      // Poor rating (red)
  // }

  getRatingColor(rating: number) {
  if (rating >= 4) {
    return { color: 'green', icon: '🍕', borderColor: '#4CAF50' }; // Green for high rating
  } else if (rating >= 3) {
    return { color: 'orange', icon: '🍔', borderColor: '#FF9800' }; // Orange for medium rating
  } else {
    return { color: 'red', icon: '🥄', borderColor: '#F44336' }; // Red for low rating
  }
}


}
