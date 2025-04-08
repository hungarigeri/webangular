import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { TagService } from '../../shared/tags/tags.component';

@Component({
  selector: 'app-receptek',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule
  ],
  templateUrl: './receptek.component.html',
  styleUrls: ['./receptek.component.css']
})
export class ReceptekComponent implements OnInit {
  allTags: string[] = [];
  tagGroups: { [key: string]: string[] } = {};
  activeFilter: string | null = null;
  filteredRecipes: any[] = [];
  
  recipes = [
    {
      id: 1,
      title: 'Házi pizzatészta',
      prepTime: 20,
      cookTime: 15,
      difficulty: 'Közepes',
      image: 'assets/pizza.jpg',
      tags: ['olasz', 'tészta', 'vegetáriánus'],
      description: 'Tökéletes pizzatészta kezdőknek és profiknak egyaránt'
    },
    {
      id: 2,
      title: 'Házi brownie',
      prepTime: 30,
      cookTime: 22,
      difficulty: 'Közepes',
      image: 'assets/brownie.jpg',
      tags: ['desszert', 'süti', 'usa'],
      description: 'Egy csokoládés, szeletelt sütemény'
    }
  ];

  constructor(private tagService: TagService) {}

  ngOnInit() {
    this.allTags = this.tagService.getAllTags();
    this.tagGroups = this.tagService.getTagGroups();
    this.setDefaultFilter();
  }

  setDefaultFilter() {
    this.activeFilter = null;
    this.filterRecipes(null);
  }

  filterRecipes(tag: string | null): void {
    this.activeFilter = tag;
    if (tag === null) {
      this.filteredRecipes = [...this.recipes];
    } else {
      this.filteredRecipes = this.recipes.filter(recipe => 
        recipe.tags.some(recipeTag => 
          this.tagService.isValidTag(recipeTag) && 
          recipeTag.toLowerCase() === tag.toLowerCase()
        )
      );
    }
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  isSelected(tag: string): boolean {
    if (tag === 'összes') return this.activeFilter === null;
    return this.activeFilter === tag;
  }
}