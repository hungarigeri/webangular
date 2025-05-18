import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TagsService  {
  private allTags: string[] = [];
  private tagGroups: Record<string, string[]> = {};
  private tagsSubject = new BehaviorSubject<string[]>([]);
  tags$ = this.tagsSubject.asObservable();

  constructor(private firestore: Firestore) {
    this.loadTagsFromFirestore();
  }

  private async loadTagsFromFirestore() {
    const tagsCollection = collection(this.firestore, 'tags');
    const querySnapshot = await getDocs(tagsCollection);
    
    this.allTags = querySnapshot.docs.map(doc => doc.data()['name']);
    this.initializeDynamicTagGroups();
    this.tagsSubject.next(this.allTags);
  }

  private initializeDynamicTagGroups() {
    // Dinamikus csoportok létrehozása a tag első karaktere alapján
    this.tagGroups = this.allTags.reduce((groups, tag) => {
      const firstChar = tag.charAt(0).toUpperCase();
      if (!groups[firstChar]) {
        groups[firstChar] = [];
      }
      groups[firstChar].push(tag);
      return groups;
    }, {} as Record<string, string[]>);
    
    // Vagy kategóriák alapján, ha van kategória információ
    // this.tagGroups = this.createCategoryGroups();
  } 
  private createCategoryGroups() {
    // Példa kategóriákra - ezt testreszabhatod
    const categories = {
      'Főételek': ['leves', 'főétel', 'tészta'],
      'Desszertek': ['desszert', 'sütemény', 'fagylalt'],
      'Italok': ['ital', 'koktél', 'sör'],
      'Gyors ételek': ['szendvics', 'saláta', 'gyors']
    };    return Object.entries(categories).reduce((groups, [category, keywords]) => {
      groups[category] = this.allTags.filter(tag => 
        keywords.some(keyword => tag.toLowerCase().includes(keyword))
      );
      return groups;
    }, {} as Record<string, string[]>);
  }

  async addNewTag(tag: string) {
    if (!this.allTags.includes(tag)) {
      const tagsCollection = collection(this.firestore, 'tags');
      await addDoc(tagsCollection, { name: tag });
      this.allTags.push(tag);
      this.initializeDynamicTagGroups();
      this.tagsSubject.next(this.allTags);
    }
  }

  getAllTags(): string[] {
    return [...this.allTags];
  }

  getTagGroups(): Record<string, string[]> {
    return { ...this.tagGroups };
  }

  isValidTag(tag: string): boolean {
    return this.allTags.includes(tag);
  }
}