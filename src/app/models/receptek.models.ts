export interface Receptek {
  id: string;
  cookTime: number;
  description: string;
   difficulty: 'Könnyű' | 'Közepes' | 'Nehéz';
  image: string;
  ingredients: string[];
  prepTime: number;
  steps: string[];
  tags: string[]; 
  title: string;
  ytlink: string;
  createdAt?: Date; // Opcionális, ha dátum szerint rendezel
}