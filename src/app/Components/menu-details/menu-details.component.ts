import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerService } from '../../Shared/Services/customer.service';

@Component({
  selector: 'app-menu-details',
  standalone: false,
  templateUrl: './menu-details.component.html',
  styleUrl: './menu-details.component.css'
})
export class MenuDetailsComponent implements OnInit {

  days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  // myMessOwnerDetailObj: { menuDetails: any[] } = { menuDetails: [] };
  myMenuOwnerDetailsList: any[] = [];
  myMessUserId: any;
  myMorningMenuList:any;
  myEveningMenuList:any;
  currentDay:any;
  constructor(private matDialogRef: MatDialogRef<any>, @Inject(MAT_DIALOG_DATA) public data: any, private customerServ: CustomerService) { }

  ngOnInit(): void {
    console.log(this.data.messOwnerUserId);
    this.myMessUserId = this.data.messOwnerUserId;
    this.customerServ.getMessDetailsForCustomer().subscribe({
      next: (res: any) => {
        // console.log(res);
        // console.log(res.menuDetails);
        this.myMenuOwnerDetailsList = res.menuDetails;
        // console.log(this.myMenuOwnerDetailsList);
        this.getMenuDetails();
      }
    });
    // this.getDays();
  }

 getMenuDetails() {
  console.log("Checking User ID:", this.myMessUserId);
  console.log("Menu Owner Details List:", this.myMenuOwnerDetailsList);

  const matchedMenu = this.myMenuOwnerDetailsList.find(
    (menuMatchUserId: any) => String(menuMatchUserId.userId).trim() === String(this.myMessUserId).trim()
  );

  if (matchedMenu) {
    console.log("Matched Menu:", matchedMenu);
    this.getDays(matchedMenu);
  } else {
    console.error("No matching userId found!");
  }
}


  getDays(menuList:any){
    const date = new Date();
    console.log(date);
    const daysNumber = date.getDay();
    console.log(daysNumber);
    const currentDayName = this.days[daysNumber];
    this.currentDay = currentDayName + ' Menu';
    console.log("Current day:", currentDayName);

    if(menuList.morning && menuList.morning[currentDayName]){
      this.myMorningMenuList = menuList.morning[currentDayName];;
      console.log('Morning Menu:', this.myMorningMenuList);
    }

    if(menuList.evening && menuList.evening[currentDayName]){
      this.myEveningMenuList = menuList.evening[currentDayName];;
      console.log('Evening Menu:', this.myEveningMenuList);
    }
   
  }

  closeDialog(): void {
    this.matDialogRef.close();
  }

}

