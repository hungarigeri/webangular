import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DifficultyPipe } from '../../pipe/difficulty';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { Posts } from '../../models/posts.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  standalone: true,
  imports: [HttpClientModule,CommonModule,MatButtonModule, MatCardModule, MatIconModule, DifficultyPipe,MatChipsModule,RouterModule,MatExpansionPanelDescription,MatExpansionPanelTitle,MatExpansionPanelHeader,MatExpansionPanel,MatAccordion],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  private http = inject(HttpClient);
  latestPosts: Posts[] = [];

  
    ngOnInit() {
      this.loadPosts();
    }
  
    private loadPosts() {
      this.http.get<Posts[]>('/assets/posts.json').subscribe({
        next: (data) => {
          // Convert string dates to Date objects
          this.latestPosts = data.map(post => ({
            ...post,
            createdAt: typeof post.createdAt === 'string' ? new Date(post.createdAt) : post.createdAt
          })).sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ).slice(0, 5); // Get 5 latest posts
        },
        error: (err) => {
          console.error('Error loading posts:', err);
          // You might want to show an error message instead of redirecting
        }
      });
    }
  
 // Add this property
 featuredIngredient = {
  name: 'Bazsalikom', // Példa hozzávaló
  image: 'assets/basil.jpg',
  description: 'Friss bazsalikom tökéletes pizzákhoz, tésztákhoz és salátákhoz'
};

// Add these recipes for the ingredient
ingredientRecipes = [
  { id: 3, title: 'Pesto brokkoli- Gnocchi'},
  { id: 1, title: 'Margherita pizza'},
  { id: 4, title: 'Caprese saláta' }
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
  {
    id: 2,
    title: "Házi brownie",
    prepTime: 31,
    cookTime: 22,
    difficulty: "Közepes",
    imageUrl: "assets/brownie.jpg",
   
  }
  // További receptek...
];

}