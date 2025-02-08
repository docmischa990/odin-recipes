document.addEventListener("DOMContentLoaded", () => {
    // Retrieve the unique recipe ID stored by main.js when a recipe was viewed
    const recipeId = localStorage.getItem("currentRecipeId");
    if (!recipeId) {
      console.error("No recipe ID found in localStorage.");
      return;
    }
  
    // Get the stored recipes array from localStorage
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    // Use loose equality (==) if your IDs might be strings vs. numbers
    const recipe = storedRecipes.find(r => r.id == recipeId);
    if (!recipe) {
      console.error("Recipe not found in storage for ID:", recipeId);
      return;
    }
  
    console.log("Loading recipe:", recipe);
  
    // --- Populate Page Elements ---
    document.getElementById("recipe-title").textContent = recipe.title;
    document.getElementById("recipe-image").src = recipe.image;
    document.getElementById("recipe-image").alt = recipe.title;
    document.getElementById("description-text").textContent = recipe.description || "";
    document.getElementById("notes-textarea").value = recipe.notes || "";
  
    // --- Load Ingredients ---
    const ingredientsList = document.getElementById("ingredients-list");
    ingredientsList.innerHTML = ""; // Clear existing content
    (recipe.ingredients || []).forEach((ingredient, index) => {
      const li = document.createElement("li");
      // Optionally include a notes-icon if desired
      li.innerHTML = `${ingredient} <span class="notes-icon" data-index="${index}" data-type="ingredient">📝</span>`;
      ingredientsList.appendChild(li);
    });
  
    // --- Load Steps ---
    const stepsList = document.getElementById("steps-list");
    stepsList.innerHTML = "";
    (recipe.steps || []).forEach((step, index) => {
      const li = document.createElement("li");
      li.innerHTML = `${step} <span class="notes-icon" data-index="${index}" data-type="step">📝</span>`;
      stepsList.appendChild(li);
    });
  
    // --- Toggle Lists for Ingredients & Steps ---
    document.querySelectorAll(".toggle-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const list = this.nextElementSibling;
        if (!list.style.display || list.style.display === "none") {
          list.style.display = "block";
          this.querySelector(".arrow").textContent = "▼";
        } else {
          list.style.display = "none";
          this.querySelector(".arrow").textContent = "▶";
        }
      });
    });
  
    // --- Load Notes Images ---
    const uploadedImagesDiv = document.getElementById("uploaded-images");
    uploadedImagesDiv.innerHTML = "";
    if (recipe.notesImages) {
      recipe.notesImages.forEach((imageSrc, index) => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("note-image-container");
        
        const img = document.createElement("img");
        img.src = imageSrc;
        img.alt = "Uploaded Note Image";
        img.classList.add("note-image");
        
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-image-btn");
        deleteBtn.textContent = "❌";
        deleteBtn.addEventListener("click", () => {
          // Remove image from recipe data and update storage
          recipe.notesImages.splice(index, 1);
          localStorage.setItem("recipes", JSON.stringify(storedRecipes));
          imgContainer.remove();
        });
        
        imgContainer.appendChild(img);
        imgContainer.appendChild(deleteBtn);
        uploadedImagesDiv.appendChild(imgContainer);
      });
    }
  
    // --- Load Description and Additional Descriptions ---
    const descriptionParagraph = document.getElementById("description-text"); // Main description paragraph
    const recipeDescriptionSection = document.querySelector(".recipe-description");
    // Clear any previous additional descriptions (if present) except the main one
    // (Assumes that the main description is in #description-text and additional ones will have class additional-description)
    document.querySelectorAll(".additional-description").forEach(el => el.remove());
    if (recipe.additionalDescriptions) {
      recipe.additionalDescriptions.forEach((desc) => {
        const newDesc = document.createElement("p");
        newDesc.textContent = desc;
        newDesc.contentEditable = true;
        newDesc.classList.add("additional-description");
        recipeDescriptionSection.appendChild(newDesc);
        
        // Add a remove button for each additional description
        const removeDescBtn = document.createElement("button");
        removeDescBtn.textContent = "Remove";
        removeDescBtn.classList.add("remove-description-btn");
        removeDescBtn.addEventListener("click", () => {
          recipeDescriptionSection.removeChild(newDesc);
          recipeDescriptionSection.removeChild(removeDescBtn);
          saveDescriptionsToLocalStorage();
        });
        recipeDescriptionSection.appendChild(removeDescBtn);
      });
    }
  
    // --- Add Ingredient/Step Functions ---
    const addItem = (type) => {
      const input = prompt(`Enter a new ${type}:`);
      if (input) {
        const list = type === "ingredient" ? ingredientsList : stepsList;
        const li = document.createElement("li");
        const itemIndex = list.children.length; // Use current list length as index
        li.innerHTML = `${input} <span class="notes-icon" data-index="${itemIndex}" data-type="${type}">📝</span>`;
        list.appendChild(li);
        recipe[type === "ingredient" ? "ingredients" : "steps"] = recipe[type === "ingredient" ? "ingredients" : "steps"] || [];
        recipe[type === "ingredient" ? "ingredients" : "steps"].push(input);
        localStorage.setItem("recipes", JSON.stringify(storedRecipes));
      }
    };
  
    document.getElementById("add-ingredient-btn").addEventListener("click", () => addItem("ingredient"));
    document.getElementById("add-step-btn").addEventListener("click", () => addItem("step"));
  
    // --- Notes Modal Functionality ---
    const modal = document.getElementById("popup-modal");
    const itemName = document.getElementById("item-name");
    const notesTextarea = document.getElementById("popup-notes");
    const saveNotesBtn = document.getElementById("save-notes-btn");
    const closeModalBtn = document.getElementById("close-modal-btn");
    let currentItemIndex = null;
    let currentItemType = null;
  
    document.body.addEventListener("click", (e) => {
      if (e.target.classList.contains("notes-icon")) {
        currentItemIndex = e.target.dataset.index;
        currentItemType = e.target.dataset.type;
        itemName.textContent = currentItemType + " " + (+currentItemIndex + 1);
        
        const notes = recipe[currentItemType + "Notes"] || [];
        notesTextarea.value = notes[currentItemIndex] || "";
        
        modal.classList.remove("hide");
      }
    });
  
    closeModalBtn.addEventListener("click", () => {\n    modal.classList.add("hide");\n  });
    
    saveNotesBtn.addEventListener("click", () => {\n    recipe[currentItemType + "Notes"] = recipe[currentItemType + "Notes"] || [];\n    recipe[currentItemType + "Notes"][currentItemIndex] = notesTextarea.value;\n    localStorage.setItem("recipes", JSON.stringify(storedRecipes));\n    modal.classList.add("hide");\n  });
    
    // --- Image Upload Handling for Notes ---\n  document.getElementById("image-upload").addEventListener("change", function (event) {\n    const files = event.target.files;\n    const uploadedImagesDiv = document.getElementById("uploaded-images");\n    recipe.notesImages = recipe.notesImages || [];\n    \n    Array.from(files).forEach((file, i) => {\n      const reader = new FileReader();\n      reader.onload = (e) => {\n        const imgContainer = document.createElement(\"div\");\n        imgContainer.classList.add(\"note-image-container\");\n        const img = document.createElement(\"img\");\n        img.src = e.target.result;\n        img.alt = `Note Image ${i + 1}`;\n        img.classList.add(\"note-image\");\n        const deleteBtn = document.createElement(\"button\");\n        deleteBtn.classList.add(\"delete-image-btn\");\n        deleteBtn.textContent = \"❌\";\n        deleteBtn.addEventListener(\"click\", () => {\n          const idx = recipe.notesImages.indexOf(e.target.result);\n          if (idx > -1) {\n            recipe.notesImages.splice(idx, 1);\n            localStorage.setItem(\"recipes\", JSON.stringify(storedRecipes));\n            imgContainer.remove();\n          }\n        });\n        imgContainer.appendChild(img);\n        imgContainer.appendChild(deleteBtn);\n        uploadedImagesDiv.appendChild(imgContainer);\n        recipe.notesImages.push(e.target.result);\n        localStorage.setItem(\"recipes\", JSON.stringify(storedRecipes));\n      };\n      reader.readAsDataURL(file);\n    });\n  });\n\n  // --- Description Editing & Additional Descriptions ---\n  const editDescriptionBtn = document.getElementById('edit-description-btn');\n  const addDescriptionBtn = document.getElementById('add-description-btn');\n  // (The main description is in #description-text, additional ones will have class additional-description)\n  \n  editDescriptionBtn.addEventListener('click', function () {\n    const descText = document.getElementById('description-text');\n    const isEditable = descText.isContentEditable;\n    descText.contentEditable = !isEditable;\n    this.textContent = isEditable ? 'Edit' : 'Save';\n    if (isEditable) {\n      recipe.description = descText.textContent.trim();\n      localStorage.setItem('recipes', JSON.stringify(storedRecipes));\n      alert('Description updated!');\n    }\n  });\n\n  addDescriptionBtn.addEventListener('click', () => {\n    const newDesc = document.createElement('p');\n    newDesc.textContent = 'Add details here...';\n    newDesc.contentEditable = true;\n    newDesc.classList.add('additional-description');\n    newDesc.style.display = 'block';\n    \n    // Create a remove button for the additional description\n    const removeBtn = document.createElement('button');\n    removeBtn.textContent = 'Remove';\n    removeBtn.classList.add('remove-description-btn');\n    removeBtn.addEventListener('click', () => {\n      recipeDescriptionSection.removeChild(newDesc);\n      recipeDescriptionSection.removeChild(removeBtn);\n      saveDescriptionsToLocalStorage();\n    });\n    recipeDescriptionSection.appendChild(newDesc);\n    recipeDescriptionSection.appendChild(removeBtn);\n  });\n\n  document.body.addEventListener('input', (event) => {\n    if (event.target.classList.contains('additional-description')) {\n      saveDescriptionsToLocalStorage();\n    }\n  });\n\n  function saveDescriptionsToLocalStorage() {\n    recipe.description = document.getElementById('description-text').textContent.trim();\n    recipe.additionalDescriptions = Array.from(document.querySelectorAll('.additional-description')).map(desc => desc.textContent.trim());\n    localStorage.setItem('recipes', JSON.stringify(storedRecipes));\n  }\n\n});\n"}]}
  