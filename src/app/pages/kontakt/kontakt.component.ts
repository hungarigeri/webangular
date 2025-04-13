import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

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
export class KontaktComponent {
  subscriptionForm: FormGroup;
  recipeForm: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
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
  }

  removeIngredient(index: number): void {
    if (this.ingredients.length > 1) {
      this.ingredients.removeAt(index);
    }
  }

  addStep(): void {
    this.steps.push(this.createStep());
  }

  removeStep(index: number): void {
    if (this.steps.length > 1) {
      this.steps.removeAt(index);
    }
  }

  onSubmit() {
    if (this.subscriptionForm.valid) {
      console.log('Subscribed with email:', this.subscriptionForm.value.email);

      this.snackBar.open('Sikeresen feliratkozott a hírlevélre!', 'Bezár', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });

      this.subscriptionForm.reset();
    }

    if (this.recipeForm.valid) {
      const formValue = {
        ...this.recipeForm.value,
        ingredients: this.recipeForm.value.ingredients.map((i: any) => i.name),
        steps: this.recipeForm.value.steps.map((s: any) => s.description),
      };

      console.log('Beküldött recept:', formValue);

      this.snackBar.open('Recept sikeresen beküldve!', 'Bezár', {
        duration: 3000,
      });
    }
  }
}
