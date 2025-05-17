import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ingredientHighlight' })
export class IngredientHighlightPipe implements PipeTransform {
  transform(description: string, ingredient: string): string {
    if (!ingredient) return description;
    return description.replace(
      new RegExp(ingredient, 'gi'), 
      match => `<strong class="highlight">${match}</strong>`
    );
  }
}