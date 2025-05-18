import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Firebase imports
import { Firestore, doc, docData } from '@angular/fire/firestore';

interface Recipe {
  id?: string;
  cookTime: number;
  description: string;
  difficulty: string;
  image: string;
  ingredients: string[];
  prepTime: number;
  steps: string[];
  title: string;
  ytlink: string;
}

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
    YouTubePlayerModule,
    MatCheckboxModule,
  ],
  templateUrl: './recept-details.component.html',
  styleUrls: ['./recept-details.component.css']
})
export class ReceptDetailsComponent implements OnInit {
  private firestore: Firestore = inject(Firestore);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  recipeId: string = '';
  recipe?: Recipe;
  checkedIngredients: string[] = [];

ngOnInit() {
  console.log('Component initialized'); // Check if this appears in console
  
  this.route.paramMap.subscribe(params => {
    this.recipeId = params.get('id') || '';
    console.log('Route param ID:', this.recipeId); // Check the ID value
    
    if (!this.recipeId) {
      console.error('No recipe ID provided');
      this.router.navigate(['/receptek']);
      return;
    }
    
    this.loadRecipe();
  });
}
private loadRecipe() {
  console.log('Trying to load recipe with ID:', this.recipeId);
  const recipeDoc = doc(this.firestore, 'receptek', this.recipeId);
  
  docData(recipeDoc).subscribe({
    next: (data) => {
      console.log('Received data:', data); // Debug what's coming from Firestore
      if (data) {
        this.recipe = { ...data, id: this.recipeId } as Recipe;
      } else {
        console.error('Document exists but data is empty');
      }
    },
    error: (err) => {
      console.error('Firestore error:', err);
      this.router.navigate(['/error']);
    }
  });
}
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

  goBack() {
    this.router.navigate(['/receptek']);
  }
}