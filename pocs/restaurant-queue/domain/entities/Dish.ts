import { DishCategory } from '../enums/DishCategory'

export class Dish {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly prepTimeMinutes: number,
    public readonly category: DishCategory,
    public readonly emoji: string,
    public readonly description: string,
  ) {
    if (prepTimeMinutes <= 0) throw new Error('Prep time must be positive')
    if (!name.trim()) throw new Error('Dish name cannot be empty')
  }

  equals(other: Dish): boolean {
    return this.id === other.id
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      prepTimeMinutes: this.prepTimeMinutes,
      category: this.category,
      emoji: this.emoji,
      description: this.description,
    }
  }
}
