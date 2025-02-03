document.addEventListener("DOMContentLoaded", () => {
    const storedRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const recipeId = localStorage.getItem("currentRecipeId");

    if (!recipeId) {
        console.error("No recipe ID found.");
        return;
    }

    const recipe = storedRecipes.find(r => r.id === recipeId);
    if (!recipe) {
        console.error("Recipe not found in storage.");
        return;
    }

    // ✅ Populate the page with recipe data
    document.getElementById("recipe-title").textContent = recipe.title;
    document.getElementById("recipe-image").src = recipe.image || "default-image.jpg"; // Fallback image
    document.getElementById("recipe-image").alt = recipe.name;
    document.getElementById("description-text").textContent = recipe.description || "";
    document.getElementById("notes-textarea").value = recipe.notes || "";

    // ✅ Load Ingredients
    const ingredientsList = document.getElementById("ingredients-list");
    (recipe.ingredients || []).forEach(ingredient => {
        const li = document.createElement("li");
        li.textContent = ingredient;
        ingredientsList.appendChild(li);
    });

    // ✅ Load Steps
    const stepsList = document.getElementById("steps-list");
    (recipe.steps || []).forEach(step => {
        const li = document.createElement("li");
        li.textContent = step;
        stepsList.appendChild(li);
    });

    // ✅ Toggle buttons for ingredients and steps
    document.querySelectorAll(".toggle-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const list = this.nextElementSibling;
            list.style.display = list.style.display === "none" ? "block" : "none";
            this.querySelector(".arrow").textContent = list.style.display === "none" ? "▶" : "▼";
        });
    });

    // ✅ Add Ingredient
    document.getElementById("add-ingredient-btn").addEventListener("click", () => {
        const ingredient = prompt("Enter a new ingredient:");
        if (ingredient) {
            recipe.ingredients.push(ingredient);
            localStorage.setItem("recipes", JSON.stringify(storedRecipes));

            const li = document.createElement("li");
            li.textContent = ingredient;
            ingredientsList.appendChild(li);
        }
    });

    // ✅ Add Step
    document.getElementById("add-step-btn").addEventListener("click", () => {
        const step = prompt("Enter a new step:");
        if (step) {
            recipe.steps.push(step);
            localStorage.setItem("recipes", JSON.stringify(storedRecipes));

            const li = document.createElement("li");
            li.textContent = step;
            stepsList.appendChild(li);
        }
    });

    // ✅ Edit and Save Description
    document.getElementById("edit-description-btn").addEventListener("click", function () {
        const descText = document.getElementById("description-text");
        const isEditable = descText.isContentEditable;
        descText.contentEditable = !isEditable;
        this.textContent = isEditable ? "Edit" : "Save";

        if (isEditable) {
            recipe.description = descText.textContent.trim();
            localStorage.setItem("recipes", JSON.stringify(storedRecipes));
            alert("Description updated!");
        }
    });

    // ✅ Save Notes
    document.getElementById("save-notes-btn").addEventListener("click", () => {
        recipe.notes = document.getElementById("notes-textarea").value;
        localStorage.setItem("recipes", JSON.stringify(storedRecipes));
        alert("Notes saved successfully!");
    });

    // ✅ Handle Image Uploads
    document.getElementById("image-upload").addEventListener("change", event => {
        const files = event.target.files;
        const uploadedImagesDiv = document.getElementById("uploaded-images");
        recipe.notesImages = recipe.notesImages || [];

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = e => {
                const imgContainer = document.createElement("div");
                imgContainer.classList.add("note-image-container");

                const img = document.createElement("img");
                img.src = e.target.result;
                img.alt = "Note Image";
                img.classList.add("note-image");

                const deleteBtn = document.createElement("button");
                deleteBtn.classList.add("delete-image-btn");
                deleteBtn.textContent = "❌";
                deleteBtn.addEventListener("click", () => {
                    recipe.notesImages = recipe.notesImages.filter(imgSrc => imgSrc !== e.target.result);
                    localStorage.setItem("recipes", JSON.stringify(storedRecipes));
                    imgContainer.remove();
                });

                imgContainer.appendChild(img);
                imgContainer.appendChild(deleteBtn);
                uploadedImagesDiv.appendChild(imgContainer);

                recipe.notesImages.push(e.target.result);
                localStorage.setItem("recipes", JSON.stringify(storedRecipes));
            };
            reader.readAsDataURL(file);
        });
    });
});
