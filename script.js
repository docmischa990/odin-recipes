// Select Elements
const addRecipeButton = document.getElementById('add-recipe-btn');
const addRecipeForm = document.getElementById('add-recipe-form');
const recipeContainer = document.getElementById('recipes');
const recipeTitleInput = document.getElementById('recipe-title');
const recipeImageInput = document.getElementById('recipe-img');
const recipeDescriptionInput = document.getElementById('recipe-description');
const recipeTypeInput = document.getElementById('recipe-type');
const saveRecipeButton = document.getElementById('save-recipe');
const successMessage = document.createElement('p');

// Add success message styling
successMessage.style.color = 'green';
successMessage.style.marginTop = '10px';
successMessage.style.display = 'none';
addRecipeForm.appendChild(successMessage);

// Toggle Form Visibility
addRecipeButton.addEventListener('click', () => {
    addRecipeForm.style.display =
        addRecipeForm.style.display === 'block' ? 'none' : 'block';
});

// Save Recipe Data to Local Storage
saveRecipeButton.addEventListener('click', (event) => {
    event.preventDefault();

    const title = recipeTitleInput.value.trim();
    const description = recipeDescriptionInput.value.trim();
    const type = recipeTypeInput.value.trim();
    const file = recipeImageInput.files[0];

    // Validate form inputs and highlight empty fields
    let isValid = true;

    if (!title) {
        recipeTitleInput.style.border = '2px solid red';
        isValid = false;
    } else {
        recipeTitleInput.style.border = '';
    }

    if (!description) {
        recipeDescriptionInput.style.border = '2px solid red';
        isValid = false;
    } else {
        recipeDescriptionInput.style.border = '';
    }

    if (!file) {
        recipeImageInput.style.border = '2px solid red';
        isValid = false;
    } else {
        recipeImageInput.style.border = '';
    }

    if (!isValid) {
        alert('Please fill in all required fields!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const base64Image = e.target.result;

        const recipeData = {
            title,
            image: base64Image,
            description,
            type,
        };

        // Get existing recipes from local storage
        const existingRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
        existingRecipes.push(recipeData);

        // Save updated recipes to local storage
        localStorage.setItem('recipes', JSON.stringify(existingRecipes));

        // Add to the DOM
        addRecipeToDOM(recipeData);

        // Clear the form
        recipeTitleInput.value = '';
        recipeImageInput.value = '';
        recipeDescriptionInput.value = '';
        recipeTypeInput.value = 'Vegetarian'; // Reset default type

        // Hide the form
        addRecipeForm.style.display = 'none';

        // Display success message
        successMessage.textContent = 'Recipe saved successfully!';
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);
    };

    reader.readAsDataURL(file);
});

// Function to Add Recipe to the DOM
function addRecipeToDOM(recipe) {
    const recipeCategory = document.querySelector(
        `.recipe-category.${recipe.type.toLowerCase()} ul`
    );

    if (!recipeCategory) {
        console.error(`No matching category found for type: ${recipe.type}`);
        return;
    }

    const recipeCard = document.createElement('li');
    recipeCard.innerHTML = `
        <div class="recipe-card">
            <img src="${recipe.image}" alt="${recipe.title}" />
            <h3>${recipe.title}</h3>
            <p>${recipe.description}</p>
            <a href="#">View Recipe</a>
        </div>
    `;
    recipeCategory.appendChild(recipeCard);
}

// Load Recipes from Local Storage on Page Load
window.addEventListener('load', () => {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    storedRecipes.forEach((recipe) => addRecipeToDOM(recipe));
});
