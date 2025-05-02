import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FindFoodApp';

  constructor(private router: Router, private ngxLoader: NgxUiLoaderService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.ngxLoader.start(); // Start loader on route change
      } else if (event instanceof NavigationEnd) {
        this.ngxLoader.stop(); // Stop loader after navigation
      }
    });
  }

 
  // onSubmit(username: string, password: string, form: HTMLFormElement) {
  //   console.log('Username:', username);
  //   console.log('Password:', password);

  //   // Clear the fields
  //   form.reset();
  // }

}



