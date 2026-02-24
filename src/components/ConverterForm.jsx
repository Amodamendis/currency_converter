// ================================================
// CURRENCY CONVERTER FORM COMPONENT
// ================================================
// This component handles the main conversion logic,
// form submission, and text-to-speech functionality
import CacheManager from '../utils/cacheManager.js';
import { useNetworkStatus } from '../utils/networkStatus.js';
import { useState } from "react";
import CurrencySelect from "./CurrencySelect.jsx";

const ConverterForm = ({ addToHistory }) => {
    // ================================================
    // STATE MANAGEMENT
    // ================================================
    
    // Store the amount entered by user
    const [amount, setAmount] = useState("");
    
    // Default currencies - USD to INR (can be changed by user)
    const [fromCurrency, setFromCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("INR");
    
    // Store the conversion result (empty initially until user converts)
    const [result, setResult] = useState("");
    
    // Track loading state during API calls
    const [isLoading, setIsLoading] = useState(false);

        // Add network status hook
const { isOfflineMode } = useNetworkStatus();

    // ================================================
    // TEXT-TO-SPEECH FUNCTIONALITY
    // ================================================
    
    /**
     * Converts text to speech using browser's built-in API
     * @param {string} text - The text to be spoken aloud
     */
    const speakResult = (text) => {
        // Check if browser supports text-to-speech
        if ('speechSynthesis' in window) {
            // Stop any currently playing speech
            window.speechSynthesis.cancel();
            
            // Create new speech utterance with the text
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Configure speech settings for better user experience
            utterance.rate = 0.8;    // Slightly slower for clarity
            utterance.pitch = 1;     // Normal pitch
            utterance.volume = 1;    // Full volume
            
            // Start speaking the text
            window.speechSynthesis.speak(utterance);
        } else {
            // Browser doesn't support TTS - log for debugging
            console.log('Text-to-speech not supported in this browser');
        }
    };

    // ================================================
    // CURRENCY SWAP FUNCTIONALITY
    // ================================================
    
    /**
     * Swaps the 'from' and 'to' currencies
     * Useful for quick conversion in opposite direction
     */
    const handleSwapCurrencies = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    }

    // ================================================
    // EXCHANGE RATE API INTEGRATION
    // ================================================
    
 
/**
 * Fetches current exchange rate and calculates conversion
 * Now supports offline mode using cached rates
 * @param {boolean} addToHistoryFlag - Whether to add this conversion to history
 */
const getExchangeRate = async (addToHistoryFlag = true) => {
    // Prevent multiple simultaneous requests
    if (isLoading) return;
    
    // Show loading state to user
    setIsLoading(true);
    
    try {
        let rate;
        let resultText;
        let isFromCache = false;

        // Try to use cached rate if in offline mode or if online request fails
        if (isOfflineMode) {
            rate = CacheManager.getCachedRate(fromCurrency, toCurrency);
            if (rate) {
                isFromCache = true;
                const convertedAmount = (rate * amount).toFixed(2);
                resultText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency} (Cached)`;
            } else {
                throw new Error("No cached rate available for this currency pair");
            }
        } else {
            // Try online API first
            try {
                const API_KEY = "03c2100d937c820d564590fe";
                const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${fromCurrency}/${toCurrency}`;
                
                const response = await fetch(API_URL);
                
                if (!response.ok) throw Error("API request failed");
                
                const data = await response.json();
                rate = data.conversion_rate;
                
                // Cache the rate for future offline use
                // Fetch and cache comprehensive rates for the base currency
                CacheManager.fetchAndCacheAllRates(fromCurrency, API_KEY);
                
                const convertedAmount = (rate * amount).toFixed(2);
                resultText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
                
            } catch (onlineError) {
                console.log("Online request failed, trying cache...");
                
                // Fallback to cached rate if online fails
                rate = CacheManager.getCachedRate(fromCurrency, toCurrency);
                if (rate) {
                    isFromCache = true;
                    const convertedAmount = (rate * amount).toFixed(2);
                    resultText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency} (Cached)`;
                } else {
                    throw new Error("No internet connection and no cached rate available");
                }
            }
        }

        // Update the result display
        setResult(resultText);
        
        // Add to history only if this is a user-initiated conversion
        if (addToHistoryFlag) {
            // Create conversion data object
            const conversionData = {
                id: Date.now(),              // Unique ID using timestamp
                amount: amount,              // Original amount
                fromCurrency: fromCurrency,  // Source currency
                toCurrency: toCurrency,      // Target currency
                result: (rate * amount).toFixed(2), // Converted amount
                timestamp: new Date().toLocaleString(), // When conversion happened
                fullText: resultText,        // Complete readable result
                isFromCache: isFromCache     // Whether this used cached data
            };
            
            // Add to parent component's history
            addToHistory(conversionData);
            
            // Speak the result for accessibility
            speakResult(resultText);
        }
        
    } catch (error) {
        // Handle any errors (network issues, invalid API response, etc.)
        const errorText = isOfflineMode ? 
            "No cached rate available for this currency pair" : 
            "Something went wrong! Check your internet connection.";
        setResult(errorText);
        
        // Speak error message if this was user-initiated
        if (addToHistoryFlag) {
            speakResult(errorText);
        }
    } finally {
        // Always hide loading state when done
        setIsLoading(false);
    }
}

    // ================================================
    // FORM SUBMISSION HANDLER
    // ================================================
    
    /**
     * Handles form submission when user clicks "Get Exchange Rate"
     * @param {Event} e - Form submission event
     */
    const handleFormSubmit = (e) => {
        // Prevent page refresh (default form behavior)
        e.preventDefault();
        
        // Fetch exchange rate and add to history
        getExchangeRate(true);
        
        // Clear the amount input for next conversion
        setAmount("");
    }

    // ================================================
    // COMPONENT RENDER
    // ================================================
    
    return (
        <form className="converter-form" onSubmit={handleFormSubmit}>
            {/* AMOUNT INPUT SECTION */}
            <div className="form-group">
                <label className="form-label">Enter Amount</label>
                <input
                    type="number"
                    className="form-input"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    placeholder="0.00"
                />
            </div>

            {/* CURRENCY SELECTION SECTION */}
            <div className="form-group form-currency-group">
                {/* FROM CURRENCY */}
                <div className="form-section">
                    <label className="form-label">From</label>
                    <CurrencySelect
                        selectedCurrency={fromCurrency}
                        handleCurrency={e => setFromCurrency(e.target.value)}
                    />
                </div>

                {/* SWAP CURRENCIES BUTTON */}
                <div className="swap-icon" onClick={handleSwapCurrencies}>
                    <svg width="16" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.13 11.66H.22a.22.22 0 0 0-.22.22v1.62a.22.22 0 0 0 .22.22h16.45l-3.92 4.94a.22.22 0 0 0 .17.35h1.97c.13 0 .25-.06.33-.16l4.59-5.78a.9.9 0 0 0-.7-1.43zM19.78 5.29H3.34L7.26.35A.22.22 0 0 0 7.09 0H5.12a.22.22 0 0 0-.34.16L.19 5.94a.9.9 0 0 0 .68 1.4H19.78a.22.22 0 0 0 .22-.22V5.51a.22.22 0 0 0-.22-.22z"
                            fill="#fff" />
                    </svg>
                </div>

                {/* TO CURRENCY */}
                <div className="form-section">
                    <label className="form-label">To</label>
                    <CurrencySelect
                        selectedCurrency={toCurrency}
                        handleCurrency={e => setToCurrency(e.target.value)}
                    />
                </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button 
                type="submit" 
                className={`${isLoading ? "loading" : ""} submit-button`}
                disabled={isLoading || !amount}
            >
                {isLoading ? "Converting..." : "Get Exchange Rate"}
            </button>
            
            {/* CONVERSION RESULT DISPLAY */}
            <p className="exchange-rate-result">
                {isLoading ? "Getting exchange rate..." : result || "Enter amount and click convert"}
            </p>
        </form>
    )
}

export default ConverterForm;