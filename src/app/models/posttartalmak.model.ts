export interface Posttartalmak {
  id: number;
  title: string;
  createdAt: string;
  excerpt: string;
  content: {
    description: string;
    ingredients: {
      granola: string[];
      yogurt: string[];
    };
    instructions: string[];
    tips: string[];
    serving: string;
    prepTime: string;
    cookTime: string;
    difficulty: string;
    tags?: string[]; // Optional as it's not in your current JSON
    origin?: string; // Optional as it's not in your current JSON
  };
  nutrition?: {
    // Optional as it's not in your current JSON
    calories: string;
    carbs: string;
    protein: string;
    fat: string;
  };
}
