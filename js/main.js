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
    // Re-select all recipes dynamically
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
            id: isEditable && editIndex !== null 
                ? existingRecipes[editIndex].id 
                : self.crypto.randomUUID(),
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
            <a href="#" class="view-recipe-btn" data-id="${recipe.id}">View Recipe</a>
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
    recipeCard.querySelector('.view-recipe-btn').addEventListener('click', (e) => {
        const recipeId = e.target.dataset.id;
        localStorage.setItem('currentRecipeId', recipeId);
        const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
        const recipe = storedRecipes.find(r => r.id == recipeId);
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
                <p class="description-paragraph">${recipe.description}</p>
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
                <textarea class="recipe-notes-input" placeholder="Add notes here...">${recipe.notes || ''}</textarea>
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
            const recipeId = "${recipe.id || self.crypto.randomUUID()}";  // This creates the unique identity

  // Load recipe data from localStorage by searching for the unique id.
  const loadRecipeData = () => {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const recipe = storedRecipes.find(r => r.id == recipeId);
    if (recipe) {
      // Load ingredients
      const ingredientsList = document.querySelector('.ingredients-list');
      ingredientsList.innerHTML = "";
      (recipe.ingredients || []).forEach((ingredient, index) => {
        const li = document.createElement('li');
        li.innerHTML = \`\${ingredient} <span class="notes-icon" data-index="\${index}" data-type="ingredient">📝</span>\`;
        ingredientsList.appendChild(li);
      });

      // Load steps
      const stepsList = document.querySelector('.steps-list');
      stepsList.innerHTML = "";
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
          if (!list.style.display || list.style.display === 'none') {
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
      uploadedImagesDiv.innerHTML = "";
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
      // Clear any previous additional descriptions
      document.querySelectorAll('.additional-description').forEach(el => el.remove());
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
    const itemIndex = list.children.length; // Get the current count as the index
    li.innerHTML = \`\${input} <span class="notes-icon" data-index="\${itemIndex}" data-type="\${type}">📝</span>\`;
    list.appendChild(li);

    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const currentRecipe = storedRecipes.find(r => r.id == recipeId);
    
    // FIX: Check if currentRecipe exists
    if (!currentRecipe) {
      console.error("Current recipe not found for id:", recipeId);
      return;
    }
    
    // Initialize the property if it doesn't exist, then push the new input
    currentRecipe[type === 'ingredient' ? 'ingredients' : 'steps'] =
      currentRecipe[type === 'ingredient' ? 'ingredients' : 'steps'] || [];
    currentRecipe[type === 'ingredient' ? 'ingredients' : 'steps'].push(input);
    
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
      const currentRecipe = storedRecipes.find(r => r.id == recipeId);
      const notes = currentRecipe[currentItemType + "Notes"] || [];
      notesTextarea.value = notes[currentItemIndex] || '';

      modal.classList.remove('hide');
    }
  });

  window.addEventListener('DOMContentLoaded', () => {
    modal.classList.add('hide');
  });

  saveNotesBtn.addEventListener('click', () => {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const currentRecipe = storedRecipes.find(r => r.id == recipeId);
    currentRecipe[currentItemType + "Notes"] = currentRecipe[currentItemType + "Notes"] || [];
    currentRecipe[currentItemType + "Notes"][currentItemIndex] = notesTextarea.value;
    localStorage.setItem('recipes', JSON.stringify(storedRecipes));
    modal.classList.add('hide');
  });

  closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hide');
  });

  // Handle image uploads in the Notes section
  document.getElementById('image-upload').addEventListener('change', function (event) {
    const files = event.target.files;
    const uploadedImagesDiv = document.querySelector('.uploaded-images');
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const currentRecipe = storedRecipes.find(r => r.id == recipeId);
    currentRecipe.notesImages = currentRecipe.notesImages || [];

    Array.from(files).forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('note-image-container');
        const img = document.createElement('img');
        img.src = e.target.result;
        img.alt = \`Note Image \${i + 1}\`;
        img.classList.add('note-image');
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-image-btn');
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", () => {
          const idx = currentRecipe.notesImages.indexOf(e.target.result);
          if (idx > -1) {
            currentRecipe.notesImages.splice(idx, 1);
            localStorage.setItem('recipes', JSON.stringify(storedRecipes));
            imgContainer.remove();
          }
        });
        imgContainer.appendChild(img);
        imgContainer.appendChild(deleteBtn);
        uploadedImagesDiv.appendChild(imgContainer);
        currentRecipe.notesImages.push(e.target.result);
        localStorage.setItem('recipes', JSON.stringify(storedRecipes));
      };
      reader.readAsDataURL(file);
    });
  });

  // Save notes in the notes section
  document.querySelector('.save-notes-btn').addEventListener('click', () => {
    const notesTextarea = document.querySelector('.recipe-notes-input');
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const currentRecipe = storedRecipes.find(r => r.id == recipeId);
    currentRecipe.notes = notesTextarea.value;
    localStorage.setItem('recipes', JSON.stringify(storedRecipes));
    console.log('Notes saved:', currentRecipe.notes);
    alert('Notes saved successfully!');
  });

  // --- Description Editing and Additional Descriptions ---
  const editDescriptionBtn = document.getElementById('edit-description-btn');
  const addDescriptionBtn = document.getElementById('add-description-btn');
  const descriptionParagraph = document.querySelector('.description-paragraph');
  const recipeDescriptionSection = document.querySelector('.recipe-description');

  // Helper function to save description data
  const saveDescriptionsToLocalStorage = () => {
    const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
    const currentRecipe = storedRecipes.find(r => r.id == recipeId);
    if (currentRecipe) {
      currentRecipe.description = document.getElementById('description-text').textContent.trim();
      currentRecipe.additionalDescriptions = Array.from(document.querySelectorAll('.additional-description')).map(desc => desc.textContent.trim());
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
      const storedRecipes = JSON.parse(localStorage.getItem('recipes')) || [];
      const currentRecipe = storedRecipes.find(r => r.id == recipeId);
      currentRecipe.description = descriptionParagraph.textContent.trim();
      localStorage.setItem('recipes', JSON.stringify(storedRecipes));
      alert('Description updated!');
    }
  });

  // Add Description Button
  addDescriptionBtn.addEventListener('click', () => {
    const newDesc = document.createElement('p');
    newDesc.textContent = 'Add details here...';
    newDesc.contentEditable = true;
    newDesc.classList.add('additional-description');
    newDesc.style.display = 'block';
    const removeDescBtn = document.createElement('button');
    removeDescBtn.textContent = 'Remove';
    removeDescBtn.classList.add('remove-description-btn');
    removeDescBtn.addEventListener('click', () => {
      recipeDescriptionSection.removeChild(newDesc);
      recipeDescriptionSection.removeChild(removeDescBtn);
      saveDescriptionsToLocalStorage();
    });
    recipeDescriptionSection.appendChild(newDesc);
    recipeDescriptionSection.appendChild(removeDescBtn);
  });

  document.body.addEventListener('input', (event) => {
    if (event.target.classList.contains('additional-description')) {
      saveDescriptionsToLocalStorage();
    }
  });

  // --- Initial load ---
  loadRecipeData();
        </script>
    </body>
    </html>
    `;

    document.open();
    document.write(recipePageContent);
    document.close();
}