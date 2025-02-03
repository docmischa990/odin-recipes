// Function to create a new recipe with a unique ID
function createRecipePage(recipe) {
    const newRecipe = createNewRecipe(recipe);
    console.log("Generated ID:", newRecipe.id);

    // Retrieve stored recipes and update them
    let storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    storedRecipes.push(newRecipe);
    localStorage.setItem('recipes', JSON.stringify(storedRecipes));

    // Store the current recipe ID in localStorage
    localStorage.setItem('currentRecipeId', newRecipe.id);
}


// Helper function to generate unique IDs
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 11);
}

// Example: Create a new recipe
const existingRecipe = { name: "Example Recipe", ingredients: [], steps: [] };
const newRecipe = createNewRecipe(existingRecipe); // Call function to create a new recipe
const recipeIndex = newRecipe.id; // Now newRecipe.id is properly assigned

// Function to create a recipe page
function createRecipePage(recipe) {
    const newRecipe = createNewRecipe(recipe); // Create a new recipe with a unique ID
console.log("Generated ID:", generateUniqueId());

const recipePageContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${newRecipe.title}</title>
        <link rel="stylesheet" href="styles/recipes.css">
    </head>
    <body>
        <header>
            <a href="index.html" class="back-arrow">&#8592; Back</a>
            <h1>${newRecipe.title}</h1>
        </header>
        <main>
            <section class="recipe-image">
                <img src="${newRecipe.image}" alt="${newRecipe.title}">
            </section>
            <section class="recipe-description">
                <h2 class="cre-h2">Description</h2>
                <p class="description-paragraph">${newRecipe.description}</p>
                <button id="edit-description-btn">Edit</button>
                <button id="add-description-btn">Add Description</button>
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
                <textarea class="recipe-notes-input" placeholder="Add notes here...">${newRecipe.notes || ''}</textarea>
                <button class="save-notes-btn">Save Notes</button>
                <h3>Add Images</h3>
                <input type="file" id="image-upload" accept="image/*" multiple>
                <div class="uploaded-images"></div>
            </section>
            <div id="popup-modal" class="hide">
                <div class="modal-content">
                    <h3>Notes for <span id="item-name"></span></h3>
                    <textarea id="popup-notes" placeholder="Enter your notes here..."></textarea>
                    <button id="save-notes-btn">Save Notes</button>
                    <button id="close-modal-btn">Close</button>
                </div>
            </div>
        </main>
        <footer>
            <p>&copy; 2025 Odin Recipes by Mischa</p>
        </footer>
        <script>

            // Load recipe data from localStorage
            const loadRecipeData = () => {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipeIndex = localStorage.getItem('currentRecipeId'); // Retrieve correct ID

    if (!recipeIndex) {
        console.error("No recipe ID found.");
        return;
    }

    const recipe = storedRecipes.find(r => r.id === recipeIndex);
    if (!recipe) {
        console.error("Recipe not found in storage.");
        return;
    }

    console.log("Loading recipe:", recipe);

    // Load ingredients, steps, and other details...
};

                    // Load steps
                    const stepsList = document.querySelector('.steps-list');
                    (recipe.steps || []).forEach((step, index) => {
                        const li = document.createElement('li');
                        li.innerHTML = \`\${step} <span class="notes-icon" data-index="\${index}" data-type="step">📝</span>\`;
                        stepsList.appendChild(li);
                    });

                    // Load notes
                    const notesTextarea = document.querySelector('.recipe-notes-input');
                    notesTextarea.value = recipe.notes || '';

                    // Toggle functionality for ingredients and steps
                    document.querySelectorAll('.toggle-btn').forEach((btn) => {
                        const arrow = btn.querySelector('.arrow');
                        btn.addEventListener('click', function () {
                            const list = this.nextElementSibling;
                            if (list.style.display === 'none' || !list.style.display) {
                                list.style.display = 'block';
                                arrow.textContent = '▼'; // Downward arrow
                            } else {
                                list.style.display = 'none';
                                arrow.textContent = '▶'; // Rightward arrow
                            }
                        });
                    });

                    // Load notes images
                    const uploadedImagesDiv = document.querySelector('.uploaded-images');
                    if (recipe.notesImages) {
                        recipe.notesImages.forEach((imageSrc, index) => {
                            const imgContainer = document.createElement('div');
                            imgContainer.classList.add('note-image-container');
                            const img = document.createElement('img');
                            img.src = imageSrc;
                            img.alt = 'Uploaded Note Image';
                            img.classList.add('note-image');
                            const deleteBtn = document.createElement('button');
                            deleteBtn.classList.add('delete-image-btn');
                            deleteBtn.innerHTML = '❌';
                            deleteBtn.addEventListener('click', () => {
                                recipe.notesImages.splice(index, 1);
                                localStorage.setItem('recipes', JSON.stringify(storedRecipes));
                                imgContainer.remove();
                            });
                            imgContainer.appendChild(img);
                            imgContainer.appendChild(deleteBtn);
                            uploadedImagesDiv.appendChild(imgContainer);
                        });
                    }

                    // Load description and additional descriptions
                    const descriptionParagraph = document.querySelector('.description-paragraph');
                    descriptionParagraph.textContent = recipe.description || '';

                    const recipeDescriptionSection = document.querySelector('.recipe-description');
                    if (recipe.additionalDescriptions) {
                        recipe.additionalDescriptions.forEach((desc) => {
                            const newDescription = document.createElement('p');
                            newDescription.textContent = desc;
                            newDescription.contentEditable = true;
                            newDescription.classList.add('additional-description');
                            recipeDescriptionSection.appendChild(newDescription);

                            // Create Remove Button for this description
                            const removeDescriptionBtn = document.createElement('button');
                            removeDescriptionBtn.textContent = 'Remove';
                            removeDescriptionBtn.classList.add('remove-description-btn');
                            removeDescriptionBtn.addEventListener('click', () => {
                                recipeDescriptionSection.removeChild(newDescription);
                                recipeDescriptionSection.removeChild(removeDescriptionBtn);

                                // Save the updated additional descriptions to localStorage
                                saveDescriptionsToLocalStorage();
                            });

                            recipeDescriptionSection.appendChild(removeDescriptionBtn);
                        });
                    }
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
                    const recipe = storedRecipes.find(r => r.id === recipeIndex);
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
                    const recipe = storedRecipes.find(r => r.id === recipeIndex);
                    const notes = recipe[currentItemType + "Notes"] || [];
                    notesTextarea.value = notes[currentItemIndex] || '';

                    modal.classList.remove('hide');
                }
            });

            window.addEventListener('DOMContentLoaded', () => {
                modal.classList.add('hide');
            });

            saveNotesBtn.addEventListener('click', () => {
                const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
                const recipe = storedRecipes.find(r => r.id === recipeIndex);
                recipe[currentItemType + "Notes"] = recipe[currentItemType + "Notes"] || [];
                recipe[currentItemType + "Notes"][currentItemIndex] = notesTextarea.value;
                localStorage.setItem('recipes', JSON.stringify(storedRecipes));
                modal.classList.add('hide');
            });

            closeModalBtn.addEventListener('click', () => {
                modal.classList.add('hide');
            });

            // Handle image uploads in the Notes section
            document.getElementById('image-upload').addEventListener('change', function (event) {
                const files = event.target.files; // Get selected files
                const uploadedImagesDiv = document.querySelector('.uploaded-images');
                const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
                const recipe = storedRecipes.find(r => r.id === recipeIndex);
                recipe.notesImages = recipe.notesImages || [];

                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const reader = new FileReader();

                    // Display the image after reading it
                    reader.onload = function (e) {
                        const imgContainer = document.createElement('div');
                        imgContainer.classList.add('note-image-container');
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = \`Note Image \${i + 1}\`;
                        img.classList.add('note-image');
                        const deleteBtn = document.createElement('button');
                        deleteBtn.classList.add('delete-image-btn');
                        deleteBtn.innerHTML = '❌';
                        deleteBtn.addEventListener('click', () => {
                            const index = recipe.notesImages.indexOf(e.target.result);
                            if (index > -1) {
                                recipe.notesImages.splice(index, 1);
                                localStorage.setItem('recipes', JSON.stringify(storedRecipes));
                                imgContainer.remove();
                            }
                        });
                        imgContainer.appendChild(img);
                        imgContainer.appendChild(deleteBtn);
                        uploadedImagesDiv.appendChild(imgContainer);

                        // Save the image as a base64 string to local storage
                        recipe.notesImages.push(e.target.result);
                        localStorage.setItem('recipes', JSON.stringify(storedRecipes));
                    };

                    reader.readAsDataURL(file); // Read file as a data URL
                }
            });

            // Save notes in the notes section
            document.querySelector('.save-notes-btn').addEventListener('click', () => {
                const notesTextarea = document.querySelector('.recipe-notes-input');
                const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
                const recipe = storedRecipes.find(r => r.id === recipeIndex);
                recipe.notes = notesTextarea.value;
                localStorage.setItem('recipes', JSON.stringify(storedRecipes));
                console.log('Notes saved:', recipe.notes);
                console.log('Stored recipes:', storedRecipes);
                alert('Notes saved successfully!');
            });

            const editDescriptionBtn = document.getElementById('edit-description-btn');
            const addDescriptionBtn = document.getElementById('add-description-btn');
            const descriptionParagraph = document.querySelector('.description-paragraph');
            const recipeDescriptionSection = document.querySelector('.recipe-description');

            // Helper function to save descriptions to localStorage
            const saveDescriptionsToLocalStorage = () => {
                const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
                const recipe = storedRecipes.find(r => r.id === recipeIndex);

                // Ensure recipe exists
                if (recipe) {
                    recipe.description = descriptionParagraph?.textContent.trim() || '';
                    recipe.additionalDescriptions = Array.from(
                        document.querySelectorAll('.additional-description')
                    ).map((desc) => desc.textContent.trim());

                    localStorage.setItem('recipes', JSON.stringify(storedRecipes));
                }
            };

            // Edit Description Button
            editDescriptionBtn.addEventListener('click', () => {
                if (!descriptionParagraph) return;

                const isEditable = descriptionParagraph.isContentEditable;
                descriptionParagraph.contentEditable = !isEditable;
                editDescriptionBtn.textContent = isEditable ? 'Edit' : 'Save';

                if (isEditable) {
                    saveDescriptionsToLocalStorage();
                    alert('Description updated!');
                }
            });

            // Add Description Button
            addDescriptionBtn.addEventListener('click', () => {
                const newDescription = document.createElement('p');
                newDescription.textContent = 'Add details here...';
                newDescription.contentEditable = true;
                newDescription.classList.add('additional-description');

                // Make it visible when added
                newDescription.style.display = 'block';

                // Create Remove Button for this description
                const removeDescriptionBtn = document.createElement('button');
                removeDescriptionBtn.textContent = 'Remove';
                removeDescriptionBtn.classList.add('remove-description-btn');
                removeDescriptionBtn.addEventListener('click', () => {
                    recipeDescriptionSection.removeChild(newDescription);
                    recipeDescriptionSection.removeChild(removeDescriptionBtn);

                    // Save the updated additional descriptions to localStorage
                    saveDescriptionsToLocalStorage();
                });

                recipeDescriptionSection.appendChild(newDescription);
                recipeDescriptionSection.appendChild(removeDescriptionBtn);
            });

            // Auto-save descriptions on input
            document.body.addEventListener('input', (event) => {
                if (event.target.classList.contains('additional-description')) {
                    saveDescriptionsToLocalStorage();
                }
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

// Hide the form when cancel is clicked
cancelRecipeButton.addEventListener('click', () => {
    addRecipeForm.style.display = 'none';
    recipeTitleInput.value = '';
    recipeImageInput.value = '';
    recipeDescriptionInput.value = '';
    recipeTypeInput.value = 'Vegetarian';
});

// Load Recipes on Page Load
window.addEventListener('load', loadRecipes);



