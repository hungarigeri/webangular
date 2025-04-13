export interface Receptektartalom {
  id: number;
  title: string;
  prepTime: number;
  cookTime: number;
  difficulty: string;
  image: string;
  ingredients: string[];
  steps: string[];
  description: string;
  ytlink?: string; // Opcionális YouTube link
}
