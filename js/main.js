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

let isEditable = false;
let editIndex = null;

// ! Toggle Form Visibility
addRecipeButton.addEventListener('click', () => {
    addRecipeForm.style.display =
        addRecipeForm.style.display === 'block' ? 'none' : 'block';
    resetForm();
});

// ! Save Recipe Data to Local Storage
saveRecipeButton.addEventListener('click', (event) => {
    event.preventDefault();

    const title = recipeTitleInput.value.trim();
    const description = recipeDescriptionInput.value.trim();
    const type = recipeTypeInput.value.trim();
    const file = recipeImageInput.files[0];

    const ingredients = [];
    const steps = [];

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

    // ! Attempt to process and save the recipe
    reader.onload = function (e) {
        const base64Image = file ? e.target.result : null;

        const recipeData = {
            title,
            image: base64Image || '',
            description,
            type,
            ingredients,
            steps,
        };

        const existingRecipes = JSON.parse(localStorage.getItem('recipes')) || [];

        if (isEditable && editIndex !== null) {
            // ! Update Recipe in Local Storage
            existingRecipes[editIndex] = recipeData;
            successMessage.textContent = 'Recipe updated successfully!';
        } else {
            // ! Add New Recipe
            existingRecipes.push(recipeData);
            successMessage.textContent = 'Recipe saved successfully!';
        }

        // ! Save to Local Storage
        localStorage.setItem('recipes', JSON.stringify(existingRecipes));

        // ! Reload Recipes in DOM
        loadRecipes();

        // ! Clear the form
        resetForm();

        // ! Hide the form
        addRecipeForm.style.display = 'none';

        // ! Display success message
        successMessage.style.color = 'green';
        successMessage.style.marginTop = '10px';
        successMessage.style.textAlign = 'center';
        successMessage.style.display = 'block';

        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 3000);

    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        reader.onload();
    }
});

// ! Function to Add Recipe to the DOM
function addRecipeToDOM(recipe, index) {
    const recipeCategory = document.querySelector(
        `.recipe-category.${recipe.type.toLowerCase()} ul`
    );

    if (!recipeCategory) {
        console.error(`No matching category found for type: ${recipe.type}`);
        return;
    }

    const recipeCard = document.createElement('li');
    recipeCard.classList.add('dynamic-card');
    recipeCard.innerHTML = `
        <div class="recipe-card">
            <img src="${recipe.image}" alt="${recipe.title}" />
            <h3>${recipe.title}</h3>
            <p>${recipe.description}</p>
            <a href="#" class="view-recipe-btn" data-index="${index}">View Recipe</a>
            <div class="recipe-actions">
                <button class="edit-btn" data-index="${index}">
                    <img src="Icons/icons8-edit.svg" alt="Edit Icon" width="20" height="20">
                </button>
                <button class="delete-btn" data-index="${index}">
                    <img src="Icons/icons8-trash.svg" alt="Delete Icon" width="20" height="20">
                </button>
            </div>
        </div>
    `;

    recipeCategory.appendChild(recipeCard);

    // ! Add Event Listener for "View Recipe"
    recipeCard.querySelector('.view-recipe-btn').addEventListener('click', () => {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipe = storedRecipes[index];
    if (recipe) createRecipePage(recipe);
});

    // ! Attach Event Listeners to Edit and Delete Buttons
    recipeCard.querySelector('.edit-btn').addEventListener('click', () => {
        loadRecipeForEditing(index);
    });

    recipeCard.querySelector('.delete-btn').addEventListener('click', () => {
        deleteRecipe(index);
    });
}

// ! Load Recipes from Local Storage on Page Load
function loadRecipes() {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const categories = document.querySelectorAll('.recipe-category ul');

    categories.forEach((ul) => {
        Array.from(ul.children).forEach((child) => {
            if (child.classList.contains('dynamic-card')) {
                child.remove();
            }
        });
    });

    // Add dynamic recipes
    storedRecipes.forEach((recipe, index) => addRecipeToDOM(recipe, index));
}


// ! Load a Recipe into the Form for Editing
function loadRecipeForEditing(index) {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipe = storedRecipes[index];

    if (!recipe) return;

    recipeTitleInput.value = recipe.title;
    recipeDescriptionInput.value = recipe.description;
    recipeTypeInput.value = recipe.type;

    if (recipe.image) {
        recipeImageInput.setAttribute('data-placeholder', 'Image already uploaded');
    }

    isEditable = true;
    editIndex = index;
    addRecipeForm.style.display = 'block';

    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

// ! Delete Recipe
function deleteRecipe(index) {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    storedRecipes.splice(index, 1);
    localStorage.setItem('recipes', JSON.stringify(storedRecipes));
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

function createRecipePage(recipe) {
    const recipePageContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${recipe.title}</title>
        <link rel="stylesheet" href="styles/recipes.css">
    </head>
    <body>
        <header>
            <a href="index.html" class="back-arrow">&#8592; Back</a>
            <h1>${recipe.title}</h1>
        </header>
        <main>
            <section class="recipe-image">
                <img src="${recipe.image}" alt="${recipe.title}">
            </section>
            <section class="recipe-description">
                <h2 class="cre-h2">Description</h2>
                <p>${recipe.description}</p>
            </section>
            <section class="recipe-ingredients">
                <h2 class="cre-h2">Ingredients</h2>
                <button class="toggle-btn">
                    <span class="arrow">▶</span>
                </button>
                <ul class="ingredients-list" style="display: none;"></ul>
                <button class="add-ingredient-btn">+ Add Ingredient</button>
            </section>
            <section class="recipe-steps">
                <h2 class="cre-h2">Steps</h2>
                <button class="toggle-btn">
                    <span class="arrow">▶</span>
                </button>
                <ol class="steps-list" style="display: none;"></ol>
                <button class="add-step-btn">+ Add Step</button>
            </section>
            <section class="recipe-notes">
                <h2 class="cre-h2">Notes</h2>
                <textarea class="recipe-notes-input" placeholder="Add notes here..."></textarea>
                <h3>Add Images</h3>
                <input type="file" id="image-upload" accept="image/*" multiple>
                <div class="uploaded-images"></div>
            </section>
        </main>
        <footer>
            <p>&copy; 2025 Odin Recipes by Mischa</p>
        </footer>
        <div id="popup-modal" class="hidden">
            <div class="modal-content">
                <h3>Notes for <span id="item-name"></span></h3>
                <textarea id="popup-notes" placeholder="Enter your notes here..."></textarea>
                <button id="save-notes-btn">Save Notes</button>
                <button id="close-modal-btn">Close</button>
            </div>
        </div>
        <script>
            const recipeIndex = ${recipe.index || 0};

            // Load recipe data from localStorage
            const loadRecipeData = () => {
                const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
                const recipe = storedRecipes[recipeIndex];
                if (recipe) {
                    // Load ingredients
                    const ingredientsList = document.querySelector('.ingredients-list');
                    (recipe.ingredients || []).forEach((ingredient, index) => {
                        const li = document.createElement('li');
                        li.innerHTML = \`\${ingredient} <span class="notes-icon" data-index="\${index}" data-type="ingredient">📝</span>\`;
                        ingredientsList.appendChild(li);
                    });

                    // Load steps
                    const stepsList = document.querySelector('.steps-list');
                    (recipe.steps || []).forEach((step, index) => {
                        const li = document.createElement('li');
                        li.innerHTML = \`\${step} <span class="notes-icon" data-index="\${index}" data-type="step">📝</span>\`;
                        stepsList.appendChild(li);
                    });
                }
            };

            // Handle ingredient and step addition
            const addItem = (type) => {
                const input = prompt(\`Enter a new \${type}:\`);
                if (input) {
                    const list = type === 'ingredient'
                        ? document.querySelector('.ingredients-list')
                        : document.querySelector('.steps-list');
                    const li = document.createElement('li');
                    const itemIndex = list.children.length; // Get the index
                    li.innerHTML = \`\${input} <span class="notes-icon" data-index="\${itemIndex}" data-type="\${type}">📝</span>\`;
                    list.appendChild(li);

                    // Save to local storage
                    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
                    const recipe = storedRecipes[recipeIndex];
                    recipe[type === 'ingredient' ? 'ingredients' : 'steps'] = recipe[type === 'ingredient' ? 'ingredients' : 'steps'] || [];
                    recipe[type === 'ingredient' ? 'ingredients' : 'steps'].push(input);
                    localStorage.setItem('recipes', JSON.stringify(storedRecipes));
                }
            };

            document.querySelector('.add-ingredient-btn').addEventListener('click', () => addItem('ingredient'));
            document.querySelector('.add-step-btn').addEventListener('click', () => addItem('step'));

            // Handle popup for notes
            const modal = document.getElementById('popup-modal');
            const itemName = document.getElementById('item-name');
            const notesTextarea = document.getElementById('popup-notes');
            const saveNotesBtn = document.getElementById('save-notes-btn');
            const closeModalBtn = document.getElementById('close-modal-btn');
            let currentItemIndex = null;
            let currentItemType = null;

            document.body.addEventListener('click', (e) => {
                if (e.target.classList.contains('notes-icon')) {
                currentItemIndex = e.target.dataset.index;
                currentItemType = e.target.dataset.type;
                itemName.textContent = currentItemType + " " + (+currentItemIndex + 1);

            const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
            const recipe = storedRecipes[recipeIndex];
            const notes = recipe[currentItemType + "Notes"] || [];
            notesTextarea.value = notes[currentItemIndex] || '';

            modal.classList.remove('hidden');

            window.addEventListener('DOMContentLoaded', () => {
            modal.classList.add('hidden');
});

            saveNotesBtn.addEventListener('click', () => {
                const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
                const recipe = storedRecipes[recipeIndex];
                recipe[currentItemType + "Notes"] = recipe[currentItemType + "Notes"] || [];
                recipe[currentItemType + "Notes"][currentItemIndex] = notesTextarea.value;
                localStorage.setItem('recipes', JSON.stringify(storedRecipes));
                modal.classList.add('hidden');
            });

            closeModalBtn.addEventListener('click', () => {
                console.log("Modal closed without saving.");
                modal.classList.add('hidden'));
            });
            // Initial load
            loadRecipeData();
        </script>
    </body>
    </html>
    `;

    document.open();
    document.write(recipePageContent);
    document.close();
}


