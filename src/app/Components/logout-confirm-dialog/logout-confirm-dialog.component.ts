import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-confirm-dialog',
  standalone: false,
  templateUrl: './logout-confirm-dialog.component.html',
  styleUrl: './logout-confirm-dialog.component.css'
})
export class LogoutConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<LogoutConfirmDialogComponent>) {}

  confirmLogout(): void {
    this.dialogRef.close(true); // Close the dialog and return true
  }

  cancel(): void {
    this.dialogRef.close(false); // Close the dialog and return false
  }

}
