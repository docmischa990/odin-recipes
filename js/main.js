// ! Select Elements
const addRecipeButton = document.getElementById('add-recipe-btn');
const addRecipeForm = document.getElementById('add-recipe-form');
const recipeContainer = document.getElementById('recipes');
const recipeTitleInput = document.getElementById('recipe-title');
const recipeImageInput = document.getElementById('recipe-img');
const recipeDescriptionInput = document.getElementById('recipe-description');
const recipeTypeInput = document.getElementById('recipe-type');
const saveRecipeButton = document.getElementById('save-recipe');
const successMessage = document.getElementById('success-message');
const cancelRecipeButton = document.getElementById('cancel-recipe-btn');
const searchBar = document.getElementById('search-bar');
const recipeCards = document.querySelectorAll('.recipe-card');
const noResultsMessage = document.createElement('p');

let isEditable = false;
let editIndex = null;

// ! Search Functionality

noResultsMessage.id = 'no-results';
noResultsMessage.textContent = 'No recipes found. Try a different keyword!';
noResultsMessage.style.display = 'none';
recipeContainer.appendChild(noResultsMessage);

// Event Listener: Search Bar Keyup
searchBar.addEventListener('keyup', handleSearch);

function handleSearch() {
    const recipeCards = document.querySelectorAll('.recipe-card');
    const searchTerm = searchBar.value.toLowerCase().trim();
    
    let filteredRecipes = Array.from(recipeCards).filter((card) => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        return title.includes(searchTerm) || description.includes(searchTerm);
    }); 

    // Reset Highlights and Update Recipe Display
    resetHighlights();
    filteredRecipes.forEach((card) => {
        card.style.display = 'block';
        highlightSearchTerms(card, searchTerm);
    });

    // Hide non-matching recipes
    recipeCards.forEach((card) => {
        if (!filteredRecipes.includes(card)) card.style.display = 'none';
    });

    // Show or Hide "No Results" Message
    noResultsMessage.style.display = filteredRecipes.length ? 'none' : 'block';
}

// Function: Highlight Matching Terms
function highlightSearchTerms(card, searchTerm) {
    const titleElement = card.querySelector('h3');
    const descriptionElement = card.querySelector('p');
    const highlightTerm = (text) =>
        text.replace(
            new RegExp(searchTerm, 'gi'),
            (match) => `<span class="highlight">${match}</span>`
        );

    if (titleElement && descriptionElement && searchTerm) {
        titleElement.innerHTML = highlightTerm(titleElement.textContent);
        descriptionElement.innerHTML = highlightTerm(descriptionElement.textContent);
    }
}

// Function: Reset Highlights
function resetHighlights() {
    recipeCards.forEach((card) => {
        const titleElement = card.querySelector('h3');
        const descriptionElement = card.querySelector('p');

        if (titleElement && descriptionElement) {
            titleElement.innerHTML = titleElement.textContent;
            descriptionElement.innerHTML = descriptionElement.textContent;
        }
    });
}

// ! Toggle Form Visibility
addRecipeButton.addEventListener('click', () => {
    addRecipeForm.style.display =
        addRecipeForm.style.display === 'block' ? 'none' : 'block';
    resetForm();
});

// ! Save Recipe Data to Local Storage
reader.onload = function(e) {
    const base64Image = file ? e.target.result : null;
    
    // Generate unique ID (only for new recipes)
    const newId = self.crypto.randomUUID(); // Modern browser API

    const recipeData = {
        id: isEditable && editIndex !== null 
            ? existingRecipes[editIndex].id // Preserve existing ID during edits
            : newId,
        title,
        image: base64Image || '',
        description,
        type,
        ingredients,
        steps,
        notes: '', // Add missing fields from second file's expectations
        notesImages: []
    };

    // ! Validate form inputs and highlight empty fields
    let isValid = true;

    if (!title) {
        recipeTitleInput.style.border = '2px solid red';
        isValid = false;
    } else {
        recipeTitleInput.style.border = '';
    }

    if (!file) {
        recipeImageInput.style.border = '2px solid red';
        isValid = false;
    } else {
        recipeImageInput.style.border = '';
    }

    if (!description) {
        recipeDescriptionInput.style.border = '2px solid red';
        isValid = false;
    } else {
        recipeDescriptionInput.style.border = '';
    }

    if (!isValid) {
        alert('Please fill in all required fields!');
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(e) {
        const base64Image = file ? e.target.result : null;
        const newId = self.crypto.randomUUID();

        const recipeData = {
            id: isEditable && editIndex !== null 
                ? existingRecipes[editIndex].id 
                : newId,
            title,
            image: base64Image || '',
            description,
            type,
            ingredients,
            steps,
            notes: '', 
            notesImages: []
        };

        const existingRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
        
        if (isEditable && editIndex !== null) {
            existingRecipes[editIndex] = recipeData;
        } else {
            existingRecipes.push(recipeData);
        }

        localStorage.setItem('recipes', JSON.stringify(existingRecipes));
        loadRecipes();
        resetForm();
        addRecipeForm.style.display = 'none';
        
        // Show success message
        successMessage.textContent = isEditable 
            ? 'Recipe updated successfully!' 
            : 'Recipe saved successfully!';
        successMessage.style.display = 'block';
        setTimeout(() => successMessage.style.display = 'none', 3000);
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        // Handle case without image
        reader.onload({ target: { result: null }});
    }
});

// ! Function to Add Recipe to the DOM
function addRecipeToDOM(recipe, index) {
    const recipeCard = document.createElement('li');
    recipeCard.classList.add('dynamic-card');
    const recipeCategory = document.querySelector(
        `.recipe-category.${recipe.type.toLowerCase()} ul`
    );

    if (!recipeCategory) {
        console.error(`No matching category found for type: ${recipe.type}`);
        return;
    }

    recipeCard.innerHTML = `
    <div class="recipe-card">
        <img src="${recipe.image}" alt="${recipe.title}" />
        <h3>${recipe.title}</h3>
        <p>${recipe.description}</p>
        <a href="#" class="view-recipe-btn" data-id="${recipe.id}">View Recipe</a>
        <div class="recipe-actions">
            <button class="edit-btn" data-id="${recipe.id}">Edit</button>
            <button class="delete-btn" data-id="${recipe.id}">Delete</button>
        </div>
    </div>
    `;

    recipeCategory.appendChild(recipeCard);

    // Add Event Listener for "View Recipe"
    recipeCard.querySelector('.view-recipe-btn').addEventListener('click', (e) => {
        const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
        const recipe = storedRecipes.find(r => r.id === e.target.dataset.id);
        if (recipe) createRecipePage(recipe);
    });

    // Attach Event Listeners to Edit and Delete Buttons
    recipeCard.querySelector('.edit-btn').addEventListener('click', () => {
        loadRecipeForEditing(index);
    });

    recipeCard.querySelector('.delete-btn').addEventListener('click', () => {
        deleteRecipe(index);
    });
}

// Update event listeners to use ID instead of index
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.view-recipe-btn').forEach((btn) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const recipeId = this.dataset.id;
            localStorage.setItem('currentRecipeId', recipeId);
            window.location.href = '../recipes/new-recipe.html';
        });
    });
});
    
        // Ensure buttons inside recipe cards work
        document.querySelectorAll('.view-recipe-btn').forEach((btn) => {
            btn.addEventListener('click', function () {
                const recipeId = this.closest('.recipe-card').dataset.recipeId; // Get the ID from the parent card
                localStorage.setItem('currentRecipeId', recipeId);
                window.location.href = '../recipes/new-recipe.html';
            });
        });
    });

    // ! Attach Event Listeners to Edit and Delete Buttons
    recipeCard.querySelector('.edit-btn').addEventListener('click', () => {
        loadRecipeForEditing(recipe.id);
    }); 

    // Delete Recipe
    recipeCard.querySelector('.delete-btn').addEventListener('click', () => {
        deleteRecipe(recipe.id);
    });
}

// ! Load Recipes from Local Storage on Page Load
function loadRecipes() {
    let storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    
    // Migrate old recipes without IDs
    const needsMigration = storedRecipes.some(r => !r.id);
    if (needsMigration) {
        storedRecipes = storedRecipes.map(recipe => ({
            ...recipe,
            id: recipe.id || self.crypto.randomUUID(),
            notes: recipe.notes || "",
            notesImages: recipe.notesImages || []
        }));
        localStorage.setItem('recipes', JSON.stringify(storedRecipes));
    }

// ! Load a Recipe into the Form for Editing
function loadRecipeForEditing(targetId) {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipeIndex = storedRecipes.findIndex(r => r.id === targetId);
    
    if (recipeIndex === -1) return;
    
    const recipe = storedRecipes[recipeIndex];
    // ... existing form population logic ...
    
    isEditable = true;
    editIndex = recipeIndex; // Still track index for localStorage update
}


// ! Delete Recipe
function deleteRecipe(targetId) {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const updatedRecipes = storedRecipes.filter(r => r.id !== targetId);
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    loadRecipes();
}

// ! Reset Form
function resetForm() {
    recipeTitleInput.value = '';
    recipeDescriptionInput.value = '';
    recipeTypeInput.value = 'Vegetarian';
    recipeImageInput.value = '';
    isEditable = false;
    editIndex = null;
}

// ! Hide the form when cancel is clicked
cancelRecipeButton.addEventListener('click', () => {
    addRecipeForm.style.display = 'none';
    recipeTitleInput.value = '';
    recipeImageInput.value = '';
    recipeDescriptionInput.value = '';
    recipeTypeInput.value = 'Vegetarian';
});

// ! Load Recipes on Page Load
window.addEventListener('load', loadRecipes);

