import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DifficultyPipe } from '../../pipe/difficulty';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  imports: [CommonModule,MatButtonModule, MatCardModule, MatIconModule, DifficultyPipe,MatChipsModule,RouterModule,MatExpansionPanelDescription,MatExpansionPanelTitle,MatExpansionPanelHeader,MatExpansionPanel,MatAccordion],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
 // Add this property
 featuredIngredient = {
  name: 'Bazsalikom', // Példa hozzávaló
  image: 'assets/basil.jpg',
  description: 'Friss bazsalikom tökéletes pizzákhoz, tésztákhoz és salátákhoz'
};

// Add these recipes for the ingredient
ingredientRecipes = [
  { id: 1, title: 'Pesto szósz' },
  { id: 2, title: 'Margherita pizza' },
  { id: 3, title: 'Caprese saláta' }
];

featuredRecipes = [
  {
    id: 1,
    title: 'Házi pizzatészta',
    prepTime: 20,
    cookTime: 15,
    difficulty: 'medium',
    imageUrl: 'assets/pizza.jpg'
  },
  // További receptek...
];

latestPosts = [
  {
    id: 1,
    title: '10 tipp a tökéletes steakhez',
    createdAt: new Date(),
    excerpt: 'Ismerd meg a hús pácolásának titkait...'
  }
  // További bejegyzések...
];
}