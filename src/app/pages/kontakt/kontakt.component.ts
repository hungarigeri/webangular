import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatOption,
  MatSelect,
  MatSelectModule,
} from '@angular/material/select';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardModule,
  MatCardTitle,
} from '@angular/material/card';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatError,
  MatFormField,
  MatLabel,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import {  collection, addDoc } from '@angular/fire/firestore';
import { TagsService } from '../../shared/tags/tags.service';
import { MatChip, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatChipsModule,
    MatAutocompleteModule,

    // Material modulok
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,

    // Egyedi komponensek
    MatCardContent,
    MatCardTitle,
    MatCardHeader,
    MatCard,
    MatIcon,
    MatCheckbox,
    MatLabel,
    MatFormField,
    MatInput,
    MatButton,
    MatError,
    MatOption,
    MatSelect,
    
  ],
  templateUrl: './kontakt.component.html',
  styleUrls: ['./kontakt.component.css'],
})
export class KontaktComponent implements OnInit {
  subscriptionForm: FormGroup;
  recipeForm: FormGroup;
   availableTags: string[] = [];
  selectedTags: string[] = [];
   private tagsService = inject(TagsService);
   tagGroups: { [key: string]: string[] } = {};


   toggleTag(tag: string): void {
  if (this.selectedTags.includes(tag)) {
    this.removeTag(tag);
  } else {
    this.addTagFromAutocomplete(tag);
  }
}
objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  constructor(private firestore: Firestore,private fb: FormBuilder, private snackBar: MatSnackBar,) {
   
    this.subscriptionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      termsAccepted: [false, Validators.requiredTrue],
    });
    

    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      prepTime: ['', [Validators.required, Validators.min(1)]],
      cookTime: ['', [Validators.required, Validators.min(0)]],
      difficulty: ['', Validators.required],
      image: [''],
      ingredients: this.fb.array([this.createIngredient()]),
      steps: this.fb.array([this.createStep()]),
      ytlink: [''],
    });
  }
   ngOnInit() {
    this.tagsService.tags$.subscribe(tags => {
      this.tagGroups = this.tagsService.getTagGroups();
      this.availableTags = tags;
    });
    // Debug kiíratások a form inicializálásakor
    console.log('----- FORM INIT DEBUG -----');
    console.log('Form status:', this.recipeForm.status);
    console.log('Form errors:', this.recipeForm.errors);
  }
  addTagFromAutocomplete(tag: string): void {
  if (tag && !this.selectedTags.includes(tag)) {
    this.selectedTags.push(tag);
    this.recipeForm.patchValue({ tags: this.selectedTags });
  }
}

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get steps(): FormArray {
    return this.recipeForm.get('steps') as FormArray;
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
    });
  }

  createStep(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
    });
  }
  

  addIngredient(): void {
  this.ingredients.push(this.createIngredient());
  this.recipeForm.updateValueAndValidity(); // Kényszerítsd a validáció frissítését!
}

  removeIngredient(index: number): void {
  if (this.ingredients.length > 1) {
    this.ingredients.removeAt(index);
    this.recipeForm.updateValueAndValidity(); // Frissítsd a form állapotát!
  }
}

  addStep(): void {
    this.steps.push(this.createStep());
     this.recipeForm.updateValueAndValidity();
  }

  removeStep(index: number): void {
    if (this.steps.length > 1) {
      this.steps.removeAt(index);
        this.steps.removeAt(index);
    }
  }



  
  // Tag handling methods
 addTag(event: MatChipInputEvent): void {
  const value = (event.value || '').trim();
  if (value && !this.selectedTags.includes(value)) {
    this.selectedTags.push(value);
    this.recipeForm.patchValue({ tags: this.selectedTags });
  }
  event.chipInput!.clear();
}
  removeTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
      this.recipeForm.patchValue({ tags: this.selectedTags });
    }
  }

async onSubmit() {
  // Hírlevélre feliratkozás kezelése
  if (this.subscriptionForm.valid) {
    try {
      const subscriptionData = {
        email: this.subscriptionForm.value.email,
        subscribedAt: new Date()
      };

      // Feliratkozás hozzáadása a Firestore 'hirlevel' kollekcióhoz
      const subscriptionsCollection = collection(this.firestore, 'hirlevel');
      await addDoc(subscriptionsCollection, subscriptionData);

      console.log('Subscribed with email:', subscriptionData.email);
      this.snackBar.open('Sikeresen feliratkozott a hírlevélre!', 'Bezár', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
      this.subscriptionForm.reset();
    } catch (error) {
      console.error('Error saving subscription:', error);
      this.snackBar.open('Hiba történt a feliratkozás során', 'Bezár', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }

  // Recept beküldés kezelése
  if (this.recipeForm.valid) {
    try {
      const formValue = {
        ...this.recipeForm.value,
        ingredients: this.recipeForm.value.ingredients.map((i: any) => i.name),
        steps: this.recipeForm.value.steps.map((s: any) => s.description),
        tags: this.selectedTags,
        createdAt: new Date()
      };

      const recipesCollection = collection(this.firestore, 'receptek');
      await addDoc(recipesCollection, formValue);

      // Save new tags to Firestore if any
      await this.saveNewTags();

      this.snackBar.open('Recept sikeresen beküldve!', 'Bezár', {
        duration: 3000,
      });
      
      this.recipeForm.reset();
      this.selectedTags = [];
    } catch (error) {
      console.error('Error submitting recipe:', error);
      this.snackBar.open('Hiba történt a recept beküldésekor', 'Bezár', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
}
  private async saveNewTags() {
    const existingTags = this.tagsService.getAllTags();
    const newTags = this.selectedTags.filter(tag => !existingTags.includes(tag));
    
    if (newTags.length > 0) {
      const tagsCollection = collection(this.firestore, 'tags');
      for (const tag of newTags) {
        await addDoc(tagsCollection, { name: tag });
      }
    }
  }
}
  

