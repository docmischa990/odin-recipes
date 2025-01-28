// localStorageUtils.js

const localStorageUtils = (() => {
    /**
     * Save data to local storage.
     * @param {string} key - The key to store the data under.
     * @param {any} value - The data to store (will be stringified).
     */
    const saveToLocalStorage = (key, value) => {
      try {
        const serializedValue = JSON.stringify(value);
        localStorage.setItem(key, serializedValue);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    };
  
    /**
     * Retrieve data from local storage.
     * @param {string} key - The key of the data to retrieve.
     * @returns {any|null} - The parsed data or null if key doesn't exist.
     */
    const getFromLocalStorage = key => {
      try {
        const serializedValue = localStorage.getItem(key);
        return serializedValue ? JSON.parse(serializedValue) : null;
      } catch (error) {
        console.error('Error retrieving from localStorage:', error);
        return null;
      }
    };
  
    /**
     * Remove data from local storage.
     * @param {string} key - The key of the data to remove.
     */
    const removeFromLocalStorage = key => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing from localStorage:', error);
      }
    };
  
    /**
     * Clear all data from local storage.
     */
    const clearLocalStorage = () => {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    };
  
    return {
      saveToLocalStorage,
      getFromLocalStorage,
      removeFromLocalStorage,
      clearLocalStorage,
    };
  })();
  
  export { localStorageUtils };
  