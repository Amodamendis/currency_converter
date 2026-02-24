/**
 * Network Status Manager
 * 
 * This utility manages network connectivity detection and provides
 * hooks for React components to respond to online/offline status changes
 */

import { useState, useEffect } from 'react';
import CacheManager from './cacheManager.js';

/**
 * Custom React hook to track network status
 * @returns {Object} - Object containing online status and related functions
 */
export const useNetworkStatus = () => {
    // State to track if user is online
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    
    // State to track if app is in offline mode (by user choice or network)
    const [isOfflineMode, setIsOfflineMode] = useState(CacheManager.getOfflineStatus());

    useEffect(() => {
        /**
         * Handle when user comes online
         */
        const handleOnline = () => {
            setIsOnline(true);
            console.log('Network connection restored');
            
            // If user didn't manually enable offline mode, exit offline mode
            if (!CacheManager.getOfflineStatus()) {
                setIsOfflineMode(false);
            }
        };

        /**
         * Handle when user goes offline
         */
        const handleOffline = () => {
            setIsOnline(false);
            setIsOfflineMode(true);
            CacheManager.setOfflineStatus(true);
            console.log('Network connection lost - switching to offline mode');
        };

        // Add event listeners for online/offline events
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Cleanup event listeners when component unmounts
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    /**
     * Manually toggle offline mode (for testing or user preference)
     */
    const toggleOfflineMode = () => {
        const newOfflineMode = !isOfflineMode;
        setIsOfflineMode(newOfflineMode);
        CacheManager.setOfflineStatus(newOfflineMode);
        
        console.log(`Offline mode ${newOfflineMode ? 'enabled' : 'disabled'} manually`);
    };

    /**
     * Force exit offline mode (when user wants to go online)
     */
    const exitOfflineMode = () => {
        if (isOnline) {
            setIsOfflineMode(false);
            CacheManager.setOfflineStatus(false);
            console.log('Exited offline mode');
        } else {
            console.log('Cannot exit offline mode - no network connection');
        }
    };

    return {
        isOnline,           // True if browser has network connection
        isOfflineMode,      // True if app is in offline mode
        toggleOfflineMode,  // Function to manually toggle offline mode
        exitOfflineMode     // Function to exit offline mode when online
    };
};

/**
 * Network Status Detection Utilities
 */
export const NetworkUtils = {
    /**
     * Check if network is available by testing connection
     * @returns {Promise<boolean>} - Promise that resolves to connection status
     */
    async checkNetworkConnection() {
        try {
            // Try to fetch a small resource to test connectivity
            const response = await fetch('https://httpbin.org/get', {
                method: 'HEAD',
                cache: 'no-cache',
                timeout: 5000
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    },

    /**
     * Get estimated connection speed (if available)
     * @returns {string} - Connection type description
     */
    getConnectionSpeed() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            return connection.effectiveType || 'unknown';
        }
        return 'unknown';
    },

    /**
     * Check if connection is suitable for API calls
     * @returns {boolean} - True if connection is good enough
     */
    isConnectionSuitable() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            // Consider 2g as too slow for API calls
            return connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g';
        }
        return true; // Assume good connection if we can't detect
    }
};