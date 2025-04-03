import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CredentialsService } from '../../Shared/Services/credentials.service';
import { ToastrService } from 'ngx-toastr';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, AfterViewInit {
  registerForm!: FormGroup;
  @ViewChild('emailInput') emailInput!: ElementRef;

  constructor(private fb: FormBuilder, private httpService: CredentialsService, private snackBar: MatSnackBar, private router: Router,private http:HttpClient) { }

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        role: ['messOwner', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.emailInput.nativeElement.focus();
    }, 0);
  }
  goToHome() {
    this.router.navigate(['/entrypoint']);
  }


  // Custom Validator to check if passwords match
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    // Store form values before any potential reset
    const formData = { ...this.registerForm.value };
  
    this.httpService.postRegisterList(formData).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.httpService.postLogIn(formData).subscribe({
          next: (resp: any) => {
            console.log('Login Successful:', resp);
            localStorage.setItem('userId', resp.userId);
            localStorage.setItem('role', resp.role);
            localStorage.setItem('token', resp.data);
  
            this.http.get('https://findfood-ashen.vercel.app/api/user/messFormRendering', {
              withCredentials: true
            }).subscribe({
              next: (_resp: any) => {
                console.log('Additional User Data:', _resp);
                console.log('my User Role >>>', _resp.role);
                // "messOwner", "customer", "admin" 
  
                if (_resp.success === true && resp.role === 'messOwner') {
                  this.router.navigate(['messdetail']);
                  this.snackBar.open('✅ Login successfully as Mess Owner!', 'OK', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    panelClass: ['success-toast']
                  });
  
                } else if (_resp.success === true && resp.role === 'customer') {
                  this.router.navigate(['/customer']);
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
          error: (err: any) => {
            console.error('Login Error:', err);
            this.snackBar.open('❌ Login failed! Please try again.', 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['error-toast']
            });
          }
        });
      },
      error: (err: any) => {
        console.error('Registration Error:', err);
        this.snackBar.open('❌ Registration failed! Please try again.', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-toast']
        });
      }
    });
  }
  

}