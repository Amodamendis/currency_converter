/**
 * App.jsx
 * 
 * This is the main component of our Currency Converter application.
 * It manages the overall layout and state of the app, including:
 * - Conversion history storage and management
 * - Coordination between different components
 * - Data persistence using browser's local storage
 */
import OfflineIndicator from "./components/OfflineIndicator";
import CacheManager from "./utils/cacheManager.js";
// Import React hooks for state management and side effects
import { useState, useEffect } from "react";

// Import our custom components
import ConverterForm from "./components/ConverterForm";      // The currency conversion form
import ConversionHistory from "./components/ConversionHistory"; // History display component
import DateTimeDisplay from "./components/DateTimeDisplay";     // Date/time display component

/**
 * Main App Component
 * 
 * This component orchestrates the entire application and manages:
 * - The conversion history state
 * - Saving/loading history from browser storage
 * - Passing functions and data to child components
 */
const App = () => {
  // State to store the list of currency conversions
  // This is an array that will contain conversion objects with details like:
  // { id, amount, fromCurrency, toCurrency, result, timestamp, fullText }
  const [conversionHistory, setConversionHistory] = useState([]);

  /**
   * Load conversion history from browser's local storage when app starts
   * 
   * useEffect with empty dependency array [] runs only once when component mounts
   * This is like a "startup" function for our app
   */
  useEffect(() => {
    // Try to get previously saved history from browser's local storage
    const savedHistory = localStorage.getItem('conversionHistory');
    
    // Check if we found any saved history
    if (savedHistory) {
      try {
        // Convert the stored string back to a JavaScript array/object
        const parsedHistory = JSON.parse(savedHistory);
        
        // Update our state with the loaded history
        setConversionHistory(parsedHistory);
      } catch (error) {
        // If something went wrong parsing the saved data, log the error
        console.error('Error parsing saved history:', error);
        
        // Remove the corrupted data from storage to prevent future issues
        localStorage.removeItem('conversionHistory');
      }
    }
  }, []); // Empty array means this runs only once when component mounts

  /**
   * Save history to browser's local storage whenever history changes
   * 
   * This useEffect runs every time conversionHistory state changes
   * It automatically saves our data so users don't lose their history
   */
  useEffect(() => {
    // Convert our history array to a string and save it to local storage
    localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
  }, [conversionHistory]); // This runs whenever conversionHistory changes

  /**
   * Function to add a new conversion to the history
   * 
   * This function will be passed to ConverterForm component
   * When user performs a conversion, ConverterForm will call this function
   * 
   * @param {Object} conversion - The conversion data to add to history
   */
  const addToHistory = (conversion) => {
    // Update the history state by adding the new conversion at the beginning
    // prev => [conversion, ...prev] means:
    // - Take the current history (prev)
    // - Create a new array with the new conversion first
    // - Then spread (...) all the old conversions after it
    setConversionHistory(prev => [conversion, ...prev]);
  };

  /**
   * Function to clear all conversion history
   * 
   * This function will be passed to ConversionHistory component
   * When user clicks "Clear All" button, this function gets called
   */
  const clearHistory = () => {
    // Reset history state to empty array
    setConversionHistory([]);
    
    // Clear all data from browser's local storage
    localStorage.clear();
    
    // Also clear session storage as a safety measure
    // (session storage is temporary and clears when browser tab closes)
    sessionStorage.clear();
  };

  // Render the main application structure
  return (
    <>
      {/* 
        Date and Time Display Component
        - This is positioned fixed in the top-right corner via CSS
        - Shows current date/time using external API
        - See DateTimeDisplay.jsx for implementation details
      */}
      <DateTimeDisplay />
      {/* 
  Offline Status Indicator Component
  - Shows current network status and offline mode
  - Provides cache management controls
  - Fixed position in top-left corner
*/}
<OfflineIndicator />
      {/* 
        Main Application Container
        - Uses CSS class "app-container" for layout styling
        - Creates side-by-side layout for converter and history
        - See index.css .app-container for styling details
      */}
      <div className="app-container">
        
        {/* 
          Currency Converter Section
          - Container div with CSS class for styling
          - Holds the main conversion form
        */}
        <div className="currency-converter">
          {/* Main title of the application */}
          <h2 className="converter-title">Currency Converter modified</h2>
          
          {/* 
            Currency Conversion Form Component
            - Handles user input for amount and currency selection
            - Fetches exchange rates from API
            - Calls addToHistory when conversion is performed
          */}
          <ConverterForm addToHistory={addToHistory} />
        </div>
        
        {/* 
          Conversion History Component
          - Displays list of previous conversions
          - Allows user to clear all history
          - Receives current history and clear function as props
        */}
        <ConversionHistory 
          history={conversionHistory}
          clearHistory={clearHistory}
        />
      </div>
    </>
  );
};

// Export the App component as the default export
// This allows other files to import this component using: import App from './App'
export default App;