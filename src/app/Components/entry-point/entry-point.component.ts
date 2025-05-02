import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LogoutConfirmDialogComponent } from '../logout-confirm-dialog/logout-confirm-dialog.component';
import { MenuDetailsComponent } from '../menu-details/menu-details.component';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../Shared/Services/customer.service';
import { FilterComponent } from '../filter/filter.component';
import { MatPaginator } from '@angular/material/paginator';

import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-entry-point',
  standalone: false,
  templateUrl: './entry-point.component.html',
  styleUrl: './entry-point.component.css'
})
export class EntryPointComponent implements OnInit,OnDestroy {
  MessDetailsForcustomer: {
    messDetails: any[], timeDetails: any[],
    rating: any[]
  } = { messDetails: [], timeDetails: [], rating: [] }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  paginatedMessDetail: any[] = [];
  pageSize = 5;
  currentPage = 0;


  searchTerm: string = '';
  FilterMessDetail: any[] = [];
  totalMessCount: number = 0;

  locations:any[] = [];

  constructor(private httpService: CustomerService, public dialog: MatDialog, private router: Router, private activatedRoute: ActivatedRoute, private ngxLoader: NgxUiLoaderService) { }

  ngOnInit(): void {
    this.getMessDetailsForCustomer();
  }

  onPageChange(event: any) { 
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedData();
  }

  updatePaginatedData() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedMessDetail = this.FilterMessDetail.slice(startIndex, endIndex);
  }

  getMessDetailsForCustomer(): void {
    this.ngxLoader.start();
    this.httpService.getMessDetailsForCustomer().subscribe({
      next: (response: any) => {
        this.ngxLoader.stop();
        // console.log('Response:', response); // Check if ratings exist
        this.MessDetailsForcustomer = response as { messDetails: any[], timeDetails: any[], rating: any[] };
        this.FilterMessDetail = response.messDetails;
        console.log(response.messDetails.length);
        this.totalMessCount = response.messDetails.length;
        this.getCityName(response)

        this.updatePaginatedData();
        

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
    this.updatePaginatedData();
  }


  navigateToShowMessDetails(userId: any) {
    this.router.navigate(['viewdata/', userId], { relativeTo: this.activatedRoute });

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
    this.updatePaginatedData();

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
    this.updatePaginatedData();
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

  getCityName(myNewMessDetailsInformationObj: any) {
    const uniqueCities = new Set(this.locations.map(city => city.toLowerCase())); 
  
    myNewMessDetailsInformationObj.messDetails.forEach((mess: any) => {
      const city = mess.address.city.trim();
      const cityLower = city.toLowerCase(); 
  
      if (!uniqueCities.has(cityLower)) { 
        uniqueCities.add(cityLower);
        this.locations.push(city);
      }
    });
  
    console.log('Unique Locations:', this.locations);
  }
  
  ngOnDestroy(): void {
    // alert("destroyed")
  }
}
