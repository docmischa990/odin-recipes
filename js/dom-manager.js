// domManager.js

const domManager = (() => {
    const renderRecipes = (recipes, container) => {
      container.innerHTML = ''; // Clear existing recipes
      recipes.forEach(recipe => {
        const recipeElement = document.createElement('div');
        recipeElement.classList.add('recipe');
        recipeElement.innerHTML = `
          <h3>${recipe.name}</h3>
          <p><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}</p>
          <p><strong>Steps:</strong> ${recipe.steps}</p>
          <p><strong>Cooking Time:</strong> ${recipe.cookingTime} minutes</p>
        `;
        container.appendChild(recipeElement);
      });
    };
  
    const bindAddRecipeForm = (form, addRecipeHandler) => {
      form.addEventListener('submit', event => {
        event.preventDefault();
  
        const name = form.querySelector('#name').value.trim();
        const ingredients = form
          .querySelector('#ingredients')
          .value.trim()
          .split(','); // Assume ingredients are comma-separated
        const steps = form.querySelector('#steps').value.trim();
        const cookingTime = parseInt(
          form.querySelector('#cookingTime').value.trim(),
          10
        );
  
        addRecipeHandler({
          name,
          ingredients,
          steps,
          cookingTime,
        });
  
        form.reset();
      });
    };
  
    return {
      renderRecipes,
      bindAddRecipeForm,
    };
  })();
  