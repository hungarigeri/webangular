import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

interface Recipe {
  id: number;
  title: string;
  prepTime: number;
  cookTime: number;
  difficulty: string;
  image: string;
  ingredients: string[];
  steps: string[];
  description: string;
}

@Component({
  selector: 'app-recept-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    RouterModule,
  ],
  templateUrl: './recept-details.component.html',
  styleUrls: ['./recept-details.component.css']
})
export class ReceptDetailsComponent {
  private route = inject(ActivatedRoute);
  recipeId = Number(this.route.snapshot.paramMap.get('id'));
  
  // Recept adatbázisunk
  private recipes: Recipe[] = [
    {
      id: 1,
      title: 'Házi pizzatészta',
      prepTime: 20,
      cookTime: 15,
      difficulty: 'Közepes',
      image: 'assets/pizza.jpg',
      description: 'Tökéletes pizzatészta kezdőknek és profiknak egyaránt',
      ingredients: [
        '500g finomliszt',
        '7g száraz élesztő',
        '1 teáskanál cukor',
        '1 teáskanál só',
        '3 evőkanál olívaolaj',
        '300ml langyos víz'
      ],
      steps: [
        'Az élesztőt a cukorral és egy kis langyos vízzel felfuttatjuk',
        'A lisztet sóval elkeverjük, majd közepébe mélyedést készítünk',
        'Hozzáadjuk az élesztős keveréket, olajat és a vizet',
        'Kemény tésztát gyúrunk és letakarva kelni hagyjuk 1 órán át',
        'Lisztezett felületen kinyújtjuk és tetszés szerint feltöltjük'
      ]
    },
    // További receptek...
  ];

  // Aktuális recept
  recipe = this.recipes.find(r => r.id === this.recipeId);

  // Vissza gomb funkció
  goBack() {
    window.history.back();
  }
}