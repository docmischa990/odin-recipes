# Odin Recipes Project

## Project Description

The **Odin Recipes Project** is a recipe website developed as part of the Odin Project curriculum. It demonstrates the use of HTML, CSS, and JavaScript to create a structured, interactive, and visually appealing web application. Users can explore recipes, add their own creations, and engage with the content in a user-friendly environment.

---

## Features

### Current Features

- **Recipe Pages:**
  - Each recipe has its own page that includes:
    - A recipe image.
    - A detailed description.
    - Ingredients with clear measurements.
    - Step-by-step preparation instructions.

- **Homepage:**
  - Displays all available recipes as interactive recipe cards.
  - Cards include:
    - An image.
    - Recipe title.
    - A short description.

- **Search Functionality:**
  - A dynamic search bar that allows users to quickly find recipes by title or description.
  - Highlights search matches for better visibility.

- **Dynamic Recipe Addition:**
  - A form for users to add their own recipes, complete with images, descriptions, and instructions.
  - User-added recipes are displayed dynamically on the homepage.

- **Interactive Recipe Cards:**
  - User-added recipes are shown as clickable cards with consistent styling.

- **Notes Section:**
   - Added an optional notes section for each recipe where users can:
     - Add personal notes or variations.
     - Attach optional images.
     - Add personal notes to each individual ingredient/step created.

- **Styling:**
  - Enhanced CSS styling with:
    - Use of CSS variables for easy theme adjustments.
    - Responsive design optimized for mobile and smaller screens.
    - Smooth hover effects on buttons and recipe cards.

---

## Technologies Used

- **HTML5:** For structuring content.
- **CSS3:** For styling and layout, including the use of CSS variables and media queries.
- **JavaScript:** For dynamic content rendering and search functionality.
- **Local File System:** For hosting the project locally during development.

---

## Installation and Usage

1. Clone the repository:

   ```bash
   git clone <https://github.com/docmischa990/odin-recipes.git>
   ```

2. Navigate to the project directory:

   ```bash
   cd odin-recipes
   ```

3. Open `index.html` in any modern web browser to view the homepage.

---

## Future Improvements

### Planned Features

1. **Local Storage Integration:**
   - Save user-created recipes locally so they remain available even after the browser is closed.

2. **Interactive Features:**
   - Allow users to rate recipes or mark them as favorites.
   - Include a "like" button for engaging content.

3. **Enhanced User Feedback:**
   - Show loader/spinner when saving or searching recipes.
   - Add validation messages for form inputs.

4. **Personalization Features:**
   - Add user profiles for a more personalized experience.
   - Allow users to save favorite recipes.
   - Include rating functionality for recipes.
   - Add category filters to organize recipes.

5. **Analytics:**
   - Track how users interact with the app to improve user experience and features.

6. **Accessibility:**
   - Add ARIA labels for screen readers to enhance accessibility.

7. **Updated UX Design:**
   - Revamp the overall design to improve usability and aesthetics.

8. **Gamification:**
   - Award badges for milestones, such as adding X number of recipes.
   - Include a progress bar for creating a complete cookbook.

### Stretch Goals

- **Global Recipe Sharing:**
  - Implement a backend setup to save user-added recipes in a shared database.
  - Enable cross-device and cross-location recipe sharing.

- **Enhanced Search:**
  - Make the search bar target additional recipe elements, such as ingredients, and improve its accuracy.

---

## Known Issues

- Currently, user-added recipes are only saved for the current session.
- Ratings, reviews, and advanced interactivity features are not yet implemented.

---

## License

This project is open source and available under the Apache License.

