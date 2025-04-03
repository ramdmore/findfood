import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CredentialsService } from '../../Shared/Services/credentials.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit,AfterViewInit {
  loginForm!: FormGroup;
  captchaText: string = '';

  @ViewChild('emailInput') emailInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private httpService: CredentialsService,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() { 
    this.initializeForm();
    this.generateCaptcha();
  }

  // Initialize form with validation
  initializeForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      captcha: ['', Validators.required]
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.emailInput.nativeElement.focus();
    }, 0);
  }

  goToHome() {
    this.router.navigate(['/entrypoint']); 
  }

  // Generate random CAPTCHA
  generateCaptcha() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    this.captchaText = Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
  }

  // Handle form submission
  onSubmit() {
    if (this.loginForm.invalid) {
      alert('Please fill all fields correctly.');
      return;
    }

    if (this.loginForm.value.captcha !== this.captchaText) {
      alert('Invalid CAPTCHA. Try again.');
      this.generateCaptcha();
      this.loginForm.controls['captcha'].reset();
      return;
    }

    console.log('Submitting Login Form:', this.loginForm.value);

    this.httpService.postLogIn(this.loginForm.value).subscribe({
      next: (resp: any) => {
        console.log('Login Response:', resp);

        // Store user details in local storage
        localStorage.setItem('userId', resp.userId);
        // localStorage.setItem('role', resp.role);

        // console.log('Role stored in localStorage:', localStorage.getItem('role'));

        // Fetch additional user data
        this.http.get('https://findfood-ashen.vercel.app/api/user/messFormRendering', {
          withCredentials: true
        }).subscribe({
          next: (_resp: any) => {
            console.log('Additional User Data:', _resp);
            console.log('my User Role >>>',_resp.role);
             //messOwner , "customer","admin" 
            //  debugger
            if (_resp.success === true && resp.role=== 'messOwner') {
              this.router.navigate(['messdetail'])
              this.snackBar.open('✅ Login successfully as Mess Owner!', 'OK', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['success-toast']
              });

            } else if (_resp.success === true && resp.role === 'customer') {
              this.router.navigate(['/customer'])

              this.snackBar.open('✅ Login successfully as Customer!', 'OK', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['success-toast']
              });
            }
          },
          error: (_err: any) => {
            console.error('Error Fetching User Data:', _err);

            if (_err.error?.success === false) {
              this.router.navigate(['messownerdashboard/dashboard']).then(() => {
                console.log('Navigated to Mess Owner Dashboard');
              });

              this.snackBar.open('✅ Login successfully as Mess Owner!', 'OK', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: ['success-toast']
              });
            }
          }
        });
      },
      error: (error) => {
        console.error('Login API Error:', error);
        this.snackBar.open('❌ Login failed! Please check credentials.', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-toast']
        });
      }
    });
  }
}
