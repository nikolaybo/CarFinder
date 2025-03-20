import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.getUser().subscribe(userResponse => {
      this.isLoggedIn = !!userResponse?.data?.user; // ✅ Check if user is logged in
    });
  }

  logOut(): void {
    this.authService.logOut().subscribe(() => {
      // Delay navigation slightly to ensure state update
      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 100);
    });
  }
}
