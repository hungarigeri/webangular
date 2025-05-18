import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DifficultyPipe } from '../../pipe/difficulty.pipe';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { Posts } from '../../models/posts.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { IngredientHighlightPipe } from '../../pipe/ingredient-highlight-pipe.pipe';
import { Firestore, collection, query, where, limit, collectionData, DocumentData, Timestamp, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Receptek } from '../../models/receptek.models';
@Component({
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    DifficultyPipe,
    MatChipsModule,
    RouterModule,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatAccordion,
    IngredientHighlightPipe
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
   private firestore = inject(Firestore);
  private http = inject(HttpClient);
  latestPosts: Posts[] = [];
   loading = false;
    recipes$: Observable<Receptek[]>;
    recipes: Receptek[] = [];
    filteredRecipes: Receptek[] = [];
    lastVisible: any = null;

     constructor() {
        const recipesCollection = collection(this.firestore, 'receptek');
        const initialQuery = query(
          recipesCollection,
          orderBy('difficulty'),
          limit(8)
        );
        this.recipes$ = collectionData(initialQuery, { idField: 'id' }) as Observable<Receptek[]>;
      }

  ngOnInit() {
    this.loadPosts();
  }
   private loadInitialRecipes() {
    this.loading = true;
    this.recipes$.subscribe({
      next: (data) => {
        this.recipes = data.map(doc => this.convertToReceptek(doc));
        this.filteredRecipes = [...this.recipes];
        this.lastVisible = data[data.length - 1];
        this.loading = false;
      },
      error: (err) => console.error('Error loading recipes:', err),
    });
  }
    private convertToReceptek(doc: DocumentData): Receptek {
      const createdAt = doc['createdAt'] 
        ? (doc['createdAt'] instanceof Timestamp ? doc['createdAt'].toDate() : new Date(doc['createdAt']))
        : new Date();
  
      return {
        id: doc['id'] || '',
        cookTime: doc['cookTime'] || 0,
        description: doc['description'] || '',
        difficulty: doc['difficulty'] || 'Közepes',
        image: doc['image'] || '',
        ingredients: doc['ingredients'] || [],
        prepTime: doc['prepTime'] || 0,
        steps: doc['steps'] || [],
        tags: doc['tags'] || [],
        title: doc['title'] || '',
        ytlink: doc['ytlink'] || '',
        createdAt
      };
    }

  private loadPosts() {
    this.http.get<Posts[]>('/assets/posts.json').subscribe({
      next: (data) => {
        // Convert string dates to Date objects
        this.latestPosts = data
          .map((post) => ({
            ...post,
            createdAt:
              typeof post.createdAt === 'string'
                ? new Date(post.createdAt)
                : post.createdAt,
          }))
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5); // Get 5 latest posts
      },
      error: (err) => {
        console.error('Error loading posts:', err);
        // You might want to show an error message instead of redirecting
      },
    });
  }

  // Add this property
  featuredIngredient = {
    name: 'Bazsalikom', // Példa hozzávaló
    image: 'assets/basil.jpg',
    description:
      'Friss bazsalikom tökéletes pizzákhoz, tésztákhoz és salátákhoz',
  };

  // Add these recipes for the ingredient
  ingredientRecipes = [
    { id: "8ISu4HSNXd657jsCctGg", title: 'Pesto brokkoli- Gnocchi' },
    { id: "eyXoAl0sbM9AwA7VzUkA", title: 'Margherita pizza' },
    { id: "wJfagU1s7F4Mpmb8gOh5", title: 'Bográcsgulyás' },
  ];

  featuredRecipes = [
    {
      id: "eyXoAl0sbM9AwA7VzUkA",
      title: 'Házi pizzatészta',
      prepTime: 20,
      cookTime: 15,
      difficulty: 'medium',
      imageUrl: 'assets/pizza.jpg',
    },
    {
      id:"i5rVT34udwQo67OTDYl0",
      title: 'Házi brownie',
      prepTime: 31,
      cookTime: 22,
      difficulty: 'Közepes',
      imageUrl: 'assets/brownie.jpg',
    },
    // További receptek...
  ];
}
