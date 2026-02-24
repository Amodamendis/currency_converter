/**
 * Cache Manager for Currency Exchange Rates
 * 
 * This utility handles caching exchange rates in browser's local storage
 * to enable offline functionality. It stores rates with timestamps and
 * manages cache expiration.
 */

// Cache configuration
const CACHE_CONFIG = {
    CACHE_KEY: 'currencyRatesCache',
    CACHE_EXPIRY_HOURS: 24, // Cache expires after 24 hours
    LAST_UPDATE_KEY: 'lastCacheUpdate',
    OFFLINE_STATUS_KEY: 'isOfflineMode'
};

/**
 * Cache Manager Class
 * Handles all caching operations for exchange rates
 */
class CacheManager {
    /**
     * Save exchange rates to cache with timestamp
     * @param {Object} ratesData - Object containing exchange rates
     * @param {string} baseCurrency - The base currency for these rates
     */
    static saveRatesToCache(ratesData, baseCurrency) {
        try {
            const cacheData = {
                rates: ratesData,
                baseCurrency: baseCurrency,
                timestamp: Date.now(),
                lastUpdate: new Date().toISOString()
            };
            
            localStorage.setItem(CACHE_CONFIG.CACHE_KEY, JSON.stringify(cacheData));
            localStorage.setItem(CACHE_CONFIG.LAST_UPDATE_KEY, Date.now().toString());
            
            console.log(`Exchange rates cached for ${baseCurrency} at ${new Date().toLocaleString()}`);
        } catch (error) {
            console.error('Error saving rates to cache:', error);
        }
    }

    /**
     * Get cached exchange rates if they exist and are not expired
     * @returns {Object|null} - Cached rates data or null if not available/expired
     */
    static getCachedRates() {
        try {
            const cachedData = localStorage.getItem(CACHE_CONFIG.CACHE_KEY);
            const lastUpdate = localStorage.getItem(CACHE_CONFIG.LAST_UPDATE_KEY);
            
            if (!cachedData || !lastUpdate) {
                return null;
            }

            const cache = JSON.parse(cachedData);
            const cacheAge = Date.now() - parseInt(lastUpdate);
            const maxAge = CACHE_CONFIG.CACHE_EXPIRY_HOURS * 60 * 60 * 1000; // Convert hours to milliseconds

            // Check if cache is expired
            if (cacheAge > maxAge) {
                console.log('Cache expired, removing old data');
                this.clearCache();
                return null;
            }

            console.log('Using cached exchange rates');
            return cache;
        } catch (error) {
            console.error('Error reading cache:', error);
            return null;
        }
    }

    /**
     * Get exchange rate between two currencies from cache
     * @param {string} fromCurrency - Source currency code
     * @param {string} toCurrency - Target currency code
     * @returns {number|null} - Exchange rate or null if not available
     */
    static getCachedRate(fromCurrency, toCurrency) {
        const cache = this.getCachedRates();
        
        if (!cache || !cache.rates) {
            return null;
        }

        // If we have direct rate (from base currency)
        if (cache.baseCurrency === fromCurrency && cache.rates[toCurrency]) {
            return cache.rates[toCurrency];
        }

        // If we have reverse rate (to base currency)
        if (cache.baseCurrency === toCurrency && cache.rates[fromCurrency]) {
            return 1 / cache.rates[fromCurrency];
        }

        // Cross-currency calculation (both currencies in cache)
        if (cache.rates[fromCurrency] && cache.rates[toCurrency]) {
            return cache.rates[toCurrency] / cache.rates[fromCurrency];
        }

        return null;
    }

    /**
     * Check if we have cached rate for specific currency pair
     * @param {string} fromCurrency - Source currency code
     * @param {string} toCurrency - Target currency code
     * @returns {boolean} - True if rate is available in cache
     */
    static hasRate(fromCurrency, toCurrency) {
        return this.getCachedRate(fromCurrency, toCurrency) !== null;
    }

    /**
     * Clear all cached data
     */
    static clearCache() {
        try {
            localStorage.removeItem(CACHE_CONFIG.CACHE_KEY);
            localStorage.removeItem(CACHE_CONFIG.LAST_UPDATE_KEY);
            localStorage.removeItem(CACHE_CONFIG.OFFLINE_STATUS_KEY);
            console.log('Currency cache cleared');
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }

    /**
     * Get cache information for display
     * @returns {Object} - Cache status information
     */
    static getCacheInfo() {
        const lastUpdate = localStorage.getItem(CACHE_CONFIG.LAST_UPDATE_KEY);
        const cache = this.getCachedRates();
        
        return {
            hasCache: !!cache,
            lastUpdate: lastUpdate ? new Date(parseInt(lastUpdate)).toLocaleString() : null,
            baseCurrency: cache?.baseCurrency || null,
            rateCount: cache?.rates ? Object.keys(cache.rates).length : 0,
            isExpired: cache ? (Date.now() - parseInt(lastUpdate)) > (CACHE_CONFIG.CACHE_EXPIRY_HOURS * 60 * 60 * 1000) : true
        };
    }

    /**
     * Set offline mode status
     * @param {boolean} isOffline - Whether the app is in offline mode
     */
    static setOfflineStatus(isOffline) {
        try {
            localStorage.setItem(CACHE_CONFIG.OFFLINE_STATUS_KEY, isOffline.toString());
        } catch (error) {
            console.error('Error setting offline status:', error);
        }
    }

    /**
     * Get offline mode status
     * @returns {boolean} - Whether the app is in offline mode
     */
    static getOfflineStatus() {
        try {
            const status = localStorage.getItem(CACHE_CONFIG.OFFLINE_STATUS_KEY);
            return status === 'true';
        } catch (error) {
            console.error('Error getting offline status:', error);
            return false;
        }
    }

    /**
     * Fetch and cache all available rates for a base currency
     * This is used to populate cache with comprehensive data
     * @param {string} baseCurrency - The base currency to fetch rates for
     * @param {string} apiKey - API key for exchange rate service
     */
    static async fetchAndCacheAllRates(baseCurrency, apiKey) {
        try {
            const API_URL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error('Failed to fetch exchange rates');
            }

            const data = await response.json();
            
            if (data.result === 'success' && data.conversion_rates) {
                this.saveRatesToCache(data.conversion_rates, baseCurrency);
                console.log(`Cached ${Object.keys(data.conversion_rates).length} exchange rates for ${baseCurrency}`);
                return true;
            } else {
                throw new Error('Invalid API response');
            }
        } catch (error) {
            console.error('Error fetching rates for cache:', error);
            return false;
        }
    }
}

export default CacheManager;