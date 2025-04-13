import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, MatListModule, MatDividerModule], // Csak a RouterModule kell
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  menuActive = false;

  toggleMenu(): void {
    this.menuActive = !this.menuActive;
  }
}
