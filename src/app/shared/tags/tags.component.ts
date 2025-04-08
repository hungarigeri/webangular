import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class TagService {
  private allTags: string[] = [
    'összes',
    'olasz',
    'desszert',
    'vegetáriánus',
    'gyors',
    'gluténmentes',
    'vegan',
    'hideg étel',
    'elme'
  ];

  private tagGroups: Record<string, string[]> = {
    'Főételek': ['olasz', 'vegetáriánus', 'vegan'],
    'Desszertek': ['desszert', 'gluténmentes'],
    'Snackek': ['gyors', 'hideg étel']
  };

  getAllTags(): string[] {
    return [...this.allTags];
  }

  getTagGroups(): Record<string, string[]> {
    return {...this.tagGroups};
  }

  // Új metódus a tag ellenőrzéshez
  isValidTag(tag: string): boolean {
    return this.allTags.includes(tag);
  }
}