import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { TagsComponent } from '../../shared/tags/tags.component';
import { Receptek } from '../../models/receptek.models';
import { HttpClient, } from '@angular/common/http';


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
  styleUrls: ['./receptek.component.css']
})
export class ReceptekComponent implements OnInit {
  allTags: string[] = [];
  tagGroups: { [key: string]: string[] } = {};
  activeFilter: string | null = null;
  filteredRecipes: any[] = [];
  recipes: Receptek[] = [];
  
 

  constructor(private tagService: TagsComponent, private http: HttpClient) {}

  ngOnInit() {
    this.allTags = this.tagService.getAllTags();
    this.tagGroups = this.tagService.getTagGroups();
    this.setDefaultFilter();
    this.http.get<Receptek[]>('/assets/receptek.json').subscribe(data => {
      this.recipes = data;
    });

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
          this.tagService.isValidTag(recipeTag) 
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