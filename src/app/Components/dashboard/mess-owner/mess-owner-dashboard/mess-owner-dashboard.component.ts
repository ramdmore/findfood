import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-mess-owner-dashboard',
  standalone: false,
  templateUrl: './mess-owner-dashboard.component.html',
  styleUrl: './mess-owner-dashboard.component.css'
})
export class MessOwnerDashboardComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  isSidebarOpen = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidenav.toggle();
  }
}
