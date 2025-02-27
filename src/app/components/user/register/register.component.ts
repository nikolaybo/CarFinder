import { Component, inject } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule],
  providers: [AuthService], // Provide AuthService only in this component
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
  private _snackBar = inject(MatSnackBar);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService.register(
      rawForm.email,
      rawForm.username,
      rawForm.password
    ).subscribe(result => {
      if (result.error) {
        this._snackBar.open(result.error.message, 'Close', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['!text-red-700']
        });
      } else {
        this.router.navigateByUrl('/');
      }
    })
  }
}
