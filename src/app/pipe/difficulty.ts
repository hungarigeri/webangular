import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'difficulty' })
export class DifficultyPipe implements PipeTransform {
  transform(value: string): string {
    const map: Record<string, string> = {
      easy: 'Könnyű',
      medium: 'Közepes',
      hard: 'Nehéz'
    };
    return map[value] || value;
  }
}