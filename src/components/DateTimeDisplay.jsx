/**
 * DateTimeDisplay.jsx
 * 
 * This component displays the current date and time in the top-right corner.
 * It fetches the current time from a free API (WorldTimeAPI) to ensure accuracy
 * and automatically updates every second to show live time.
 * 
 * Features:
 * - Real-time clock that updates every second
 * - Timezone display
 * - Fallback to local time if API fails
 * - Separate display boxes for time and date
 */

// Import React hooks for state management and side effects
import { useState, useEffect } from 'react';

/**
 * DateTimeDisplay Component
 * 
 * This component manages and displays current date/time information.
 * It uses external API for accurate time and falls back to local time if needed.
 */
const DateTimeDisplay = () => {
  // State to store the current time string (e.g., "2:30:45 PM")
  const [currentTime, setCurrentTime] = useState('');
  
  // State to store the current date string (e.g., "Mon, Jul 22, 2025")
  const [currentDate, setCurrentDate] = useState('');
  
  // State to store the timezone information (e.g., "America/New_York")
  const [timezone, setTimezone] = useState('');

  /**
   * Main effect hook that sets up the time fetching and updating
   * Runs once when the component mounts (like a startup function)
   */
  useEffect(() => {
    /**
     * Function to fetch current time from WorldTimeAPI
     * This is an async function because we need to wait for the API response
     */
    const fetchCurrentTime = async () => {
      try {
        // Make a request to WorldTimeAPI - a free service that provides accurate time
        // The /api/ip endpoint automatically detects user's location based on IP thats why without any code it chooses srilankan timezone
        const response = await fetch('https://worldtimeapi.org/api/ip');
        
        // Convert the response to JSON format so we can use the data
        const data = await response.json();
        
        // Create a Date object from the API's datetime string
        const dateTime = new Date(data.datetime);
        
        // Store the timezone information from the API
        setTimezone(data.timezone);
        
        // Update our display with the API time
        updateDateTime(dateTime);
        
        // Set up a timer to update the display every second (1000 milliseconds)
        // This keeps our clock "live" and current
        const interval = setInterval(() => {
          // Create a new Date object representing "right now"
          const now = new Date();
          updateDateTime(now);
        }, 1000);
        
        // Cleanup function: if this component is removed, clear the timer
        // This prevents memory leaks and unnecessary processing
        return () => clearInterval(interval);
        
      } catch (error) {
        // If the API request fails (no internet, API down, etc.)
        console.error('Error fetching time:', error);
        
        // Fallback: use the user's local computer time
        const now = new Date();
        updateDateTime(now);
        setTimezone('Local Time'); // Indicate we're using local time
        
        // Still set up the interval to keep updating with local time
        const interval = setInterval(() => {
          const now = new Date();
          updateDateTime(now);
        }, 1000);
        
        // Cleanup function for fallback scenario too
        return () => clearInterval(interval);
      }
    };

    /**
     * Function to format and update the time and date displays
     * Takes a Date object and converts it to user-friendly strings
     * 
     * @param {Date} dateTime - The Date object to format
     */
    const updateDateTime = (dateTime) => {
      // Format the time in 12-hour format with AM/PM
      // Example output: "2:30:45 PM"
      const timeString = dateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',    // Show hour with 2 digits (01, 02, etc.)
        minute: '2-digit',  // Show minute with 2 digits
        second: '2-digit',  // Show second with 2 digits
        hour12: true        // Use 12-hour format with AM/PM
      });
      
      // Format the date in a readable format
      // Example output: "Mon, Jul 22, 2025"
      const dateString = dateTime.toLocaleDateString('en-US', {
        weekday: 'short',   // Short day name (Mon, Tue, etc.)
        year: 'numeric',    // Full year (2025)
        month: 'short',     // Short month name (Jan, Feb, etc.)
        day: 'numeric'      // Day of month (1, 2, 3, etc.)
      });
      
      // Update our state variables with the formatted strings
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    // Call our fetch function to start the whole process
    fetchCurrentTime();
  }, []); // Empty dependency array means this runs only once when component mounts

  // Render the date and time display
  return (
    // Main container - positioned via CSS (see index.css .datetime-container)
    <div className="datetime-container">
      
      {/* 
        Time Display Box - The larger, more prominent display
        Shows current time and timezone
        Styled with CSS class .time-display in index.css
      */}
      <div className="time-display">
        {/* The actual time text (e.g., "2:30:45 PM") */}
        <div className="time-text">{currentTime}</div>
        
        {/* 
          Timezone display - only show if we have timezone info
          Uses conditional rendering: {condition && <element>}
          If timezone exists, show the timezone text
        */}
        {timezone && <div className="timezone-text">{timezone}</div>}
      </div>
      
      {/* 
        Date Display Box - Smaller box below the time
        Shows current date
        Styled with CSS class .date-display in index.css
      */}
      <div className="date-display">
        {/* The actual date text (e.g., "Mon, Jul 22, 2025") */}
        <div className="date-text">{currentDate}</div>
      </div>
    </div>
  );
};

// Export the component so it can be imported and used in other files
export default DateTimeDisplay;