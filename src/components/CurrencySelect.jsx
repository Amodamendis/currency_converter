/**
 * CurrencySelect.jsx
 * 
 * This component creates a dropdown menu for selecting currencies.
 * It displays a flag icon next to the currency code for better user experience.
 * The flag is fetched from a free flag API based on the currency's country code.
 */

// Complete list of supported currency codes (ISO 4217 standard)
// These are 3-letter codes representing different world currencies
const currencyCodes = [
    "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AUD", "AWG", "AZN",
    "BAM", "BBD", "BDT", "BGN", "BHD", "BIF", "BMD", "BND", "BOB", "BRL",
    "BSD", "BTN", "BWP", "BYN", "BZD", "CAD", "CDF", "CHF", "CLP", "CNY",
    "COP", "CRC", "CUP", "CVE", "CZK", "DJF", "DKK", "DOP", "DZD", "EGP",
    "ERN", "ETB", "EUR", "FJD", "FKP", "FOK", "GBP", "GEL", "GGP", "GHS",
    "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HRK", "HTG", "HUF",
    "IDR", "ILS", "IMP", "INR", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD",
    "JPY", "KES", "KGS", "KHR", "KID", "KMF", "KRW", "KWD", "KYD", "KZT",
    "LAK", "LBP", "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD",
    "MMK", "MNT", "MOP", "MRU", "MUR", "MVR", "MWK", "MXN", "MYR", "MZN",
    "NAD", "NGN", "NIO", "NOK", "NPR", "NZD", "OMR", "PAB", "PEN", "PGK",
    "PHP", "PKR", "PLN", "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR",
    "SBD", "SCR", "SDG", "SEK", "SGD", "SHP", "SLE", "SLL", "SOS", "SRD",
    "SSP", "STN", "SYP", "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY",
    "TTD", "TVD", "TWD", "TZS", "UAH", "UGX", "USD", "UYU", "UZS", "VES",
    "VND", "VUV", "WST", "XAF", "XCD", "XOF", "XPF", "YER", "ZAR", "ZMW",
    "ZWL"
];

/**
 * CurrencySelect Component
 * 
 * Props:
 * - selectedCurrency: The currently selected currency code (string)
 * - handleCurrency: Function to handle when user selects a different currency
 * 
 * This component renders:
 * 1. A flag image based on the selected currency
 * 2. A dropdown menu with all available currencies
 */
const CurrencySelect = ({ selectedCurrency, handleCurrency }) => {
    // Extract the first 2 letters from currency code to get country code
    // Example: "USD" becomes "US", "EUR" becomes "EU", "INR" becomes "IN"
    const countryCode = selectedCurrency.substring(0, 2);

    return (
        // Container div with CSS class for styling (see index.css .currency-select)
        <div className="currency-select">
            {/* 
                Flag image from FlagsAPI - a free service that provides flag images
                The URL format: https://flagsapi.com/[COUNTRY_CODE]/flat/64.png
                - countryCode: 2-letter country code derived from currency
                - flat: flag style (flat design)
                - 64: image size in pixels
            */}
            <img 
                src={`https://flagsapi.com/${countryCode}/flat/64.png`} 
                alt={`${selectedCurrency} Flag`} 
            />
            
            {/* 
                Dropdown select element
                - value: currently selected currency (controlled component)
                - onChange: calls handleCurrency when user selects different option
                - className: for CSS styling (see index.css .currency-dropdown)
            */}
            <select
                onChange={handleCurrency}
                className="currency-dropdown"
                value={selectedCurrency}
            >
                {/* 
                    Generate option elements for each currency code
                    map() creates an array of <option> elements from currencyCodes array
                    key: unique identifier for React (prevents warning and improves performance)
                    value: the currency code that will be selected
                    Display text: same as currency code
                */}
                {currencyCodes.map(currency => (
                    <option key={currency} value={currency}>
                        {currency}
                    </option>
                ))}
            </select>
        </div>
    );
};

// Export the component so it can be imported and used in other files
export default CurrencySelect;