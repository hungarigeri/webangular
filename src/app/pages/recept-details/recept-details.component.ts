import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Receptektartalom } from '../../models/receptektartalom.model';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-recept-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    RouterModule,
    YouTubePlayerModule, // Module-t importálj, nem a komponenst
    HttpClientModule,
    MatCheckbox,
  ],
  templateUrl: './recept-details.component.html',
  styleUrls: ['./recept-details.component.css'],
})
export class ReceptDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);

  recipeId = Number(this.route.snapshot.paramMap.get('id'));
  recipes: Receptektartalom[] = [];
  recipe?: Receptektartalom;
  checkedIngredients: string[] = [];

  isIngredientChecked(ingredient: string): boolean {
    return this.checkedIngredients.includes(ingredient);
  }

  toggleIngredient(ingredient: string, isChecked: boolean): void {
    if (isChecked) {
      if (!this.checkedIngredients.includes(ingredient)) {
        this.checkedIngredients.push(ingredient);
      }
    } else {
      this.checkedIngredients = this.checkedIngredients.filter(
        (item) => item !== ingredient
      );
    }
  }

  ngOnInit() {
    this.loadRecipes();
  }

  private loadRecipes() {
    this.http
      .get<Receptektartalom[]>('/assets/receptek-detail.json')
      .subscribe({
        next: (data) => {
          this.recipes = data;
          this.recipe = this.recipes.find((r) => r.id === this.recipeId);

          if (!this.recipe) {
            console.warn(`Nem található recept ${this.recipeId} ID-val`);
          }
        },
        error: (err) => {
          console.error('Hiba a receptek betöltésekor:', err);
          this.router.navigate(['/error']); // Átirányítás hiba esetén
        },
      });
  }

  goBack() {
    this.router.navigate(['/receptek']);
  }
}
