import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { TagsService } from '../../shared/tags/tags.service';
import { Receptek } from '../../models/receptek.models';

// Firebase imports
import { Firestore, collectionData, collection, query, where, orderBy, limit, startAfter, DocumentData } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-receptek',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule,
  ],
  templateUrl: './receptek.component.html',
  styleUrls: ['./receptek.component.css'],
})
export class ReceptekComponent implements OnInit {
  tagGroups: { [key: string]: string[] } = {};
  activeFilter: string | null = null;
  filteredRecipes: Receptek[] = [];
  recipes: Receptek[] = [];
  lastVisible: any = null;
  loading = false;
  hasMore = true;

  // Firebase
  private firestore: Firestore = inject(Firestore);
  private tagsService = inject(TagsService);
  recipes$: Observable<Receptek[]>;

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
    this.loadInitialRecipes();
    this.initTags();
     this.tagsService.tags$.subscribe(() => {
    this.initTags(); // Csak akkor hívódik meg, ha a tagek betöltődtek
  });
  this.loadInitialRecipes();
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
// 1. WHERE feltétel alapján szűrés (nehéz receptek)
loadDifficultRecipes() {
  const recipesCollection = collection(this.firestore, 'receptek');
  const difficultQuery = query(
    recipesCollection,
    where('difficulty', '==', 'Nehéz'),
    orderBy('title'),
    limit(5)
  );
  
  (collectionData(difficultQuery, { idField: 'id' }) as Observable<Receptek[]>).subscribe({
    next: (data) => {
      this.filteredRecipes = data.map(doc => this.convertToReceptek(doc));
    }
  });
}

// 2. Rendezés és limitálás (legújabb receptek)
loadNewestRecipes() {
  const recipesCollection = collection(this.firestore, 'receptek');
  const newestQuery = query(
    recipesCollection,
    orderBy('createdAt', 'desc'),
    limit(3)
  );
  
  (collectionData(newestQuery, { idField: 'id' }) as Observable<Receptek[]>).subscribe({
    next: (data) => {
      this.filteredRecipes = data.map(doc => this.convertToReceptek(doc));
    }
  });
}

// 3. Több feltétel kombinálása (gyors és könnyű receptek)
loadQuickEasyRecipes() {
  const recipesCollection = collection(this.firestore, 'receptek');
  const quickEasyQuery = query(
    recipesCollection,
    where('difficulty', '==', 'Könnyű'),
    where('prepTime', '<=', 20),
    orderBy('prepTime'),
    limit(5)
  );
  
  (collectionData(quickEasyQuery, { idField: 'id' }) as Observable<Receptek[]>).subscribe({
    next: (data) => {
      this.filteredRecipes = data.map(doc => this.convertToReceptek(doc));
    }
  });
}

// 4. Lapozás (pagination)
loadMoreRecipes() {
  if (!this.hasMore || this.loading) return;

  this.loading = true;
  const recipesCollection = collection(this.firestore, 'receptek');
  const nextQuery = query(
    recipesCollection,
    orderBy('difficulty'),
    startAfter(this.lastVisible),
    limit(4)
  );
  
  (collectionData(nextQuery, { idField: 'id' }) as Observable<Receptek[]>).subscribe({
    next: (data) => {
      if (data.length < 4) this.hasMore = false;
      this.recipes = [...this.recipes, ...data];
      this.filteredRecipes = [...this.filteredRecipes, ...data];
      this.lastVisible = data[data.length - 1];
      this.loading = false;
    }
  });
}

  private initTags() {
    this.tagGroups = this.tagsService.getTagGroups();
    this.setDefaultFilter();
  }

  setDefaultFilter() {
    this.activeFilter = 'összes';
    this.filterRecipes('összes');
  }

 filterRecipes(tag: string | null): void {
  this.activeFilter = tag;
  this.filteredRecipes =
    tag === null || tag === 'összes'
      ? [...this.recipes]
      : this.recipes.filter((recipe) =>
          recipe.tags?.some((t) => 
            this.tagsService.isValidTag(t) && 
            t.toLowerCase() === tag.toLowerCase()
          )
        );
}

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  isSelected(tag: string): boolean {
    return (
      this.activeFilter === tag ||
      (tag === 'összes' && this.activeFilter === null)
    );
  }
}