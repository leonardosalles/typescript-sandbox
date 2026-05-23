import { Dish } from '../entities/Dish'
import { DishCategory } from '../enums/DishCategory'

export class DishFactory {
  static create(
    id: string,
    name: string,
    prepTimeMinutes: number,
    category: DishCategory,
    emoji: string,
    description: string,
  ): Dish {
    return new Dish(id, name, prepTimeMinutes, category, emoji, description)
  }

  static createMenu(): Dish[] {
    return [
      DishFactory.create('d1', 'Bruschetta',        5,  DishCategory.STARTER,  '🍞', 'Toasted bread with tomato and basil'),
      DishFactory.create('d2', 'Caesar Salad',       8,  DishCategory.STARTER,  '🥗', 'Crisp romaine lettuce with caesar dressing'),
      DishFactory.create('d3', 'Soup of the Day',    10, DishCategory.STARTER,  '🍲', 'Chef\'s daily soup selection'),
      DishFactory.create('d4', 'Margherita Pizza',   15, DishCategory.MAIN,     '🍕', 'Classic tomato and mozzarella'),
      DishFactory.create('d5', 'Grilled Salmon',     20, DishCategory.MAIN,     '🐟', 'Atlantic salmon with herb butter'),
      DishFactory.create('d6', 'Beef Tenderloin',    30, DishCategory.MAIN,     '🥩', 'Prime cut with red wine reduction'),
      DishFactory.create('d7', 'Pasta Carbonara',    12, DishCategory.MAIN,     '🍝', 'Spaghetti with egg, cheese and pancetta'),
      DishFactory.create('d8', 'Risotto Fungi',      25, DishCategory.MAIN,     '🍄', 'Arborio rice with wild mushrooms'),
      DishFactory.create('d9', 'Tiramisu',           3,  DishCategory.DESSERT,  '🍮', 'Classic Italian coffee dessert'),
      DishFactory.create('d10', 'Chocolate Lava',    12, DishCategory.DESSERT,  '🍫', 'Warm chocolate cake with molten center'),
      DishFactory.create('d11', 'Fresh Juice',       2,  DishCategory.DRINK,    '🍹', 'Seasonal fresh-pressed juice'),
      DishFactory.create('d12', 'Craft Cocktail',    5,  DishCategory.DRINK,    '🍸', 'Artisan mixed drink'),
    ]
  }
}
