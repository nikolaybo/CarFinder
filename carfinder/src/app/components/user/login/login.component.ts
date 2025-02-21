import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule, MatInputModule, MatButtonModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);

  logInform = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage: string | null = null;

  onSubmit(): void {
    const rawForm = this.logInform.getRawValue();
    this.authService.logIn(
      rawForm.email,
      rawForm.password,
    ).subscribe(result => {
      if (result.error) {
        console.log('err');
        this._snackBar.open(result.error.message, 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['!text-red-700']
        });
        this.errorMessage = result.error.message;
      } else {
        this.router.navigateByUrl('/');
      }
    })
  }
}
