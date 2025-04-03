import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../Shared/Services/customer.service';
import { FilterComponent } from '../filter/filter.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuDetailsComponent } from '../menu-details/menu-details.component';
import { LogoutConfirmDialogComponent } from '../logout-confirm-dialog/logout-confirm-dialog.component';

@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.css'],
  standalone: false
})
export class CustomerDashboardComponent implements OnInit {

  MessDetailsForcustomer: {
    messDetails: any[], timeDetails: any[],
    rating: any[]
  } = { messDetails: [], timeDetails: [], rating: [] }

  searchTerm: string = '';
  FilterMessDetail: any[] = [];

  locations = ['Pune', 'Delhi', 'Solapur', 'Amravati', 'Mumbai', 'Murgud']

  constructor(private httpService: CustomerService, public dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getMessDetailsForCustomer();
  }

  getMessDetailsForCustomer(): void {
    this.httpService.getMessDetailsForCustomer().subscribe({
      next: (response: any) => {
        // console.log('Response:', response); // Check if ratings exist
        this.MessDetailsForcustomer = response as { messDetails: any[], timeDetails: any[], rating: any[] };
        this.FilterMessDetail = response.messDetails;
      },
      error: (error: any) => {
        console.error('Error fetching mess details:', error);
      }
    });
  }


  getTimeDetailsForCustomers(userId: any): any {
    return this.MessDetailsForcustomer.timeDetails.find(details => details.userId === userId);
  }


  getMessStatus(timeDetails?: any): { status: string; color: string } {
    if (!timeDetails || (!timeDetails.morning && !timeDetails.evening)) {
      return { status: 'Closed', color: 'red' };
    }
  
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert current time to minutes
  
    // Extract and convert time details safely
    const morningOpen = timeDetails.morning?.from ? this.convertTimeToMinutes(timeDetails.morning.from) : null;
    const morningClose = timeDetails.morning?.to ? this.convertTimeToMinutes(timeDetails.morning.to) : null;
    const eveningOpen = timeDetails.evening?.from ? this.convertTimeToMinutes(timeDetails.evening.from) : null;
    const eveningClose = timeDetails.evening?.to ? this.convertTimeToMinutes(timeDetails.evening.to) : null;
  
    const isMorningOpen = morningOpen !== null && morningClose !== null && currentTime >= morningOpen && currentTime < morningClose;
    const isEveningOpen = eveningOpen !== null && eveningClose !== null && currentTime >= eveningOpen && currentTime < eveningClose;
  
    if (isMorningOpen || isEveningOpen) {
      // Check if it is "Closing Soon" (last 30 minutes)
      if ((morningClose !== null && morningClose - currentTime > 0 && morningClose - currentTime <= 30) ||
          (eveningClose !== null && eveningClose - currentTime > 0 && eveningClose - currentTime <= 30)) {
        return { status: 'Closing Soon', color: 'yellow' };
      }
      return { status: 'Open', color: 'blue' };
    }
  
    // Check if it is "Opening Soon" (within next 30 minutes)
    const nextOpeningTime = (morningOpen !== null && currentTime < morningOpen) ? morningOpen :
                            (eveningOpen !== null && currentTime < eveningOpen) ? eveningOpen : null;
  
    if (nextOpeningTime !== null && nextOpeningTime - currentTime <= 30) {
      return { status: 'Opening Soon', color: 'yellow' };
    }
  
    return { status: 'Closed', color: 'red' };
  }
  

  private convertTimeToMinutes(time?: string): number {
    if (!time) return null as any; // Return `null` to avoid incorrect calculations
    const [hours, minutes] = time.split(':').map(Number);
    return (isNaN(hours) || isNaN(minutes)) ? null as any : hours * 60 + minutes;
  }



  // myFilterLogic() {
  //   const dialogRef = this.dialog.open(FilterComponent, {
  //     width: '400px',
  //     position: { right: '10px', top: '70px' },
  //     panelClass: 'filter-dialog'
  //   });
  // }

  myFilterLogic() {
    const dialogRef = this.dialog.open(FilterComponent, {
      width: '350px',
      position: { right: '10px', top: '70px' },
      panelClass: 'filter-dialog'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.applyFilters(result.rating, result.foodType);
      }
    });
  }

  applyFilters(selectedRating: string, selectedFoodType: string) {
    this.FilterMessDetail = this.MessDetailsForcustomer.messDetails.filter((mess: any) => {
      let ratingMatch = selectedRating === 'Any' || this.getRating(mess.userId) >= parseFloat(selectedRating);
      let foodTypeMatch = selectedFoodType === 'Both' || mess.foodType === selectedFoodType;

      return ratingMatch && foodTypeMatch;
    });
  }


  navigateToShowMessDetails(userId: any) {
    this.router.navigate(['messviewdetails/', userId], { relativeTo: this.activatedRoute });

    this.httpService.addViewsToCustomer(userId).subscribe({
      next: (_resp: any) => {
        console.log(_resp);
        // alert('success')
      },
      error: (_error: any) => {
        console.log(_error);
        // alert('error')
      }
    })
  }

  SearchData() {
    console.log(this.searchTerm);
    if (!this.searchTerm) {
      this.FilterMessDetail = this.MessDetailsForcustomer.messDetails;
    } else {
      this.FilterMessDetail = this.MessDetailsForcustomer.messDetails.filter((mess: any) =>
        mess.messName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        mess.address.city.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        mess.address.area.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  selectedLocation = ''; // Variable to track selected location

  onLocationSearch(location: string): void {
    if (!location) {
      // If no location is selected, reset to original data
      this.FilterMessDetail = [...this.MessDetailsForcustomer.messDetails];
    } else {
      // Filter mess details based on location
      this.FilterMessDetail = this.MessDetailsForcustomer.messDetails.filter((mess: any) =>
        mess.address.city.toLowerCase().includes(location.toLowerCase())
      );
    }
  }


  star: any;
  stars = [1, 2, 3, 4, 5]

  getRating(userId: any): number {
    const userRatings = this.MessDetailsForcustomer.rating.filter((data: any) => data.messUserId === userId);

    if (userRatings.length > 0) {
      const totalRating = userRatings.reduce((total, current) => total + current.rating, 0);
      const avgRating = totalRating / userRatings.length;
      return avgRating;
    }

    return 0.0; // Explicitly return 0.0 when no ratings exist
  }



  getStarDetails(rating: number): { full: number[]; half: boolean; empty: number[] } {
    if (rating === 0) {
      return { full: [], half: false, empty: Array(5).fill(1) }; // Show 5 empty stars for 0 rating
    }

    const fullStar = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStar = 5 - fullStar - (halfStar ? 1 : 0);

    return {
      full: Array(fullStar).fill(1),
      half: halfStar,
      empty: Array(emptyStar).fill(1),
    };
  }

  viewMenu(messId: string): void {
    // console.log('Viewing menu for mess:', messId);
    this.dialog.open(MenuDetailsComponent, {
      width: '100%',
      maxWidth: '600px',
      position: { right: '300px', top: '120px' },
      // panelClass: 'filter-dialog',
      data: { messOwnerUserId: messId }
    });
  }


  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(LogoutConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.signout();
      }
    });
  }

  signout() {

    localStorage.removeItem('userId');
    console.log("Logout done successfully");

    this.router.navigate(['/login']);
  }

}