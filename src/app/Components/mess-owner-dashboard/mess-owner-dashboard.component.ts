import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { LogoutConfirmDialogComponent } from '../logout-confirm-dialog/logout-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-mess-owner-dashboard',
  standalone: false,
  templateUrl: './mess-owner-dashboard.component.html',
  styleUrl: './mess-owner-dashboard.component.css'
})
export class MessOwnerDashboardComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  constructor( private router : Router,private dialog: MatDialog){}

  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidenav.toggle();
    
  }



  

  openLogoutDialog(): void {
    const dialogRef = this.dialog.open(LogoutConfirmDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logout();
      }
    });
  }

  logout(){
    localStorage.removeItem('token');
    console.log("Logout done Successfully"); 
    
    this.router.navigate(['/login']);  
  }
}
