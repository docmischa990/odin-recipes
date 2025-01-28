// File: recipeManager.js
export function addRecipe(recipe) {
    const recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    recipes.push(recipe);
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

export function getRecipes() {
    return JSON.parse(localStorage.getItem('recipes')) || [];
}

export function deleteRecipe(index) {
    const recipes = getRecipes();
    recipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(recipes));
}

export function editRecipe(index, updatedRecipe) {
    const recipes = getRecipes();
    recipes[index] = updatedRecipe;
    localStorage.setItem('recipes', JSON.stringify(recipes));
}
