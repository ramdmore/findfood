import { Component } from '@angular/core';

@Component({
  selector: 'app-time',
  standalone: false,
  templateUrl: './time.component.html',
  styleUrl: './time.component.css'
})
export class TimeComponent {
  listDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']


}
