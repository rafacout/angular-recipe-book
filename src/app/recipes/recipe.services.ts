import {Recipe} from "./recipe.model";
import {Injectable} from "@angular/core";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";

@Injectable()
export class RecipeService {

  private recipes: Recipe[] = [
    new Recipe('Test Recipe 1', 'hfjdsk fhdjsk fhdjsk fhdsjk', 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&webp=true&resize=300,272',
      [
        new Ingredient('Meat', 1),
        new Ingredient('Bread', 1),
      ]),
    new Recipe('Test Recipe 2', 'bla bla bla', 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg?quality=90&webp=true&resize=300,272',
      [
        new Ingredient('Meat', 1),
        new Ingredient('Bread', 1),
      ]),
  ];

  constructor(private shoppingList: ShoppingListService) { }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }
  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingList.addIngredients(ingredients);
  }
}
