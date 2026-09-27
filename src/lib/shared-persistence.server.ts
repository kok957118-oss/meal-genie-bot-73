import { supabaseAdmin } from "@/integrations/supabase/client.server";

type PersistedRecipe = {
  id: string;
  ingredients: Array<{ name: string; quantity?: string | undefined }>;
  calories?: number | null | undefined;
  protein_g?: number | null | undefined;
  carbs_g?: number | null | undefined;
  fat_g?: number | null | undefined;
};

export async function persistRecipeDetails(recipe: PersistedRecipe) {
  const ingredients = recipe.ingredients
    .map((ingredient) => ({
      name: ingredient.name.trim(),
      quantity: ingredient.quantity?.trim() || null,
    }))
    .filter((ingredient) => ingredient.name.length > 0);

  if (ingredients.length > 0) {
    const db = supabaseAdmin as any;
    const { data: catalogIngredients, error: catalogError } = await db
      .from("ingredients")
      .upsert(ingredients.map(({ name }) => ({ name })), { onConflict: "name" })
      .select("id,name");
    if (catalogError) throw new Error(catalogError.message);

    const catalogByName = new Map(
      ((catalogIngredients ?? []) as Array<{ name: string; id: string }>).map((item) => [item.name, item.id]),
    );
    const { error: ingredientError } = await db.from("recipe_ingredients").insert(
      ingredients.map((ingredient, sort_order) => ({
        recipe_id: recipe.id,
        ingredient_id: catalogByName.get(ingredient.name) ?? null,
        name: ingredient.name,
        quantity: ingredient.quantity,
        sort_order,
      })),
    );
    if (ingredientError) throw new Error(ingredientError.message);
  }

  const db = supabaseAdmin as any;
  const { error: nutritionError } = await db.from("recipe_nutrition").upsert({
    recipe_id: recipe.id,
    calories: recipe.calories ?? null,
    protein_g: recipe.protein_g ?? null,
    carbs_g: recipe.carbs_g ?? null,
    fat_g: recipe.fat_g ?? null,
  });
  if (nutritionError) throw new Error(nutritionError.message);
}

export async function persistGeneratedRecipe(recipe: PersistedRecipe) {
  await persistRecipeDetails(recipe);
}
