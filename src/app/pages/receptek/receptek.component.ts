import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TagsComponent } from '../../shared/tags/tags.component'; // Komponens importálva
import { Receptek } from '../../models/receptek.models';

@Component({
  selector: 'app-receptek',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule,
  
  ],
  templateUrl: './receptek.component.html',
  styleUrls: ['./receptek.component.css']
})
export class ReceptekComponent implements OnInit {
  allTags: string[] = [];
  tagGroups: { [key: string]: string[] } = {};
  activeFilter: string | null = null;
  filteredRecipes: Receptek[] = [];
  recipes: Receptek[] = [];
  
  constructor(private tagsComponent: TagsComponent, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Receptek[]>('/assets/receptek.json').subscribe({
      next: (data) => {
        this.recipes = data;
        this.filteredRecipes = [...data];
        this.initTags();
      },
      error: (err) => console.error('Hiba a receptek betöltésekor:', err)
    });
  }

  private initTags() {
    // Ha a TagsComponent-ben vannak a tag metódusok
    this.allTags = this.tagsComponent['getAllTags']?.() || [];
    this.tagGroups = this.tagsComponent['getTagGroups']?.() || {};
    this.setDefaultFilter();
  }

  setDefaultFilter() {
    this.activeFilter = 'összes';
    this.filterRecipes('összes');
  }

  filterRecipes(tag: string | null): void {
    this.activeFilter = tag;
    this.filteredRecipes = tag === null || tag === 'összes' 
      ? [...this.recipes]
      : this.recipes.filter(recipe => 
          recipe.tags.some(t => t.toLowerCase() === tag.toLowerCase())
        );
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  isSelected(tag: string): boolean {
    return this.activeFilter === tag || (tag === 'összes' && this.activeFilter === null);
  }
}