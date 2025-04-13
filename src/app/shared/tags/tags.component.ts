import { Component, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TagsComponent {
  private allTags: string[] = [
    'összes',
    'olasz',
    'desszert',
    'vegetáriánus',
    'gyors',
    'gluténmentes',
    'vegan',
    'hideg étel',
    'magyar videó',
    'angol videó',
    'nincs videó',
  ];

  private tagGroups: Record<string, string[]> = {
    Video: ['magyar videó', 'angol videó', 'nincs videó'],
    Főételek: ['olasz', 'vegetáriánus', 'vegan'],
    Desszertek: ['desszert', 'gluténmentes'],
    Snackek: ['gyors', 'hideg étel'],
  };

  getAllTags(): string[] {
    return [...this.allTags];
  }

  getTagGroups(): Record<string, string[]> {
    return { ...this.tagGroups };
  }

  // Új metódus a tag ellenőrzéshez
  isValidTag(tag: string): boolean {
    return this.allTags.includes(tag);
  }
}
