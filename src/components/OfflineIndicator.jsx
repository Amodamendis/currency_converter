/**
 * OfflineIndicator.jsx
 * 
 * This component displays the current network/offline status to users
 * and provides controls for cache management and offline mode toggling
 */

import { useState } from 'react';
import { useNetworkStatus } from '../utils/networkStatus.js';
import CacheManager from '../utils/cacheManager.js';

const OfflineIndicator = () => {
    // Get network status from our custom hook
    const { isOnline, isOfflineMode, toggleOfflineMode, exitOfflineMode } = useNetworkStatus();
    
    // State for showing cache details
    const [showCacheDetails, setShowCacheDetails] = useState(false);
    
    // Get cache information
    const cacheInfo = CacheManager.getCacheInfo();

    /**
     * Handle clearing the cache
     */
    const handleClearCache = () => {
        if (window.confirm('Are you sure you want to clear the cached exchange rates?')) {
            CacheManager.clearCache();
            // Force re-render by toggling cache details
            setShowCacheDetails(false);
        }
    };

    /**
     * Get status text and color based on current state
     */
    const getStatusInfo = () => {
        if (isOfflineMode) {
            return {
                text: cacheInfo.hasCache ? 'Offline Mode (Cached Rates)' : 'Offline Mode (No Cache)',
                color: cacheInfo.hasCache ? '#FFA500' : '#FF6B6B',
                icon: '📱'
            };
        } else if (isOnline) {
            return {
                text: 'Online',
                color: '#4CAF50',
                icon: '🌐'
            };
        } else {
            return {
                text: 'No Connection',
                color: '#FF6B6B',
                icon: '❌'
            };
        }
    };

    const statusInfo = getStatusInfo();

    return (
        <div className="offline-indicator">
            {/* Main status display */}
            <div 
                className="status-display"
                style={{ borderLeftColor: statusInfo.color }}
                onClick={() => setShowCacheDetails(!showCacheDetails)}
            >
                <span className="status-icon">{statusInfo.icon}</span>
                <div className="status-content">
                    <div className="status-text">{statusInfo.text}</div>
                    {isOfflineMode && cacheInfo.lastUpdate && (
                        <div className="status-subtitle">
                            Last updated: {cacheInfo.lastUpdate}
                        </div>
                    )}
                </div>
                <div className="status-toggle">
                    {showCacheDetails ? '▼' : '▶'}
                </div>
            </div>

            {/* Expandable cache details */}
            {showCacheDetails && (
                <div className="cache-details">
                    <div className="cache-info">
                        <div className="cache-stat">
                            <span className="cache-label">Cache Status:</span>
                            <span className="cache-value">
                                {cacheInfo.hasCache ? 'Available' : 'Empty'}
                            </span>
                        </div>
                        
                        {cacheInfo.hasCache && (
                            <>
                                <div className="cache-stat">
                                    <span className="cache-label">Base Currency:</span>
                                    <span className="cache-value">{cacheInfo.baseCurrency}</span>
                                </div>
                                <div className="cache-stat">
                                    <span className="cache-label">Cached Rates:</span>
                                    <span className="cache-value">{cacheInfo.rateCount}</span>
                                </div>
                                <div className="cache-stat">
                                    <span className="cache-label">Status:</span>
                                    <span className={`cache-value ${cacheInfo.isExpired ? 'expired' : 'fresh'}`}>
                                        {cacheInfo.isExpired ? 'Expired' : 'Fresh'}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Control buttons */}
                    <div className="cache-controls">
                        {isOnline && isOfflineMode && (
                            <button 
                                className="cache-btn online-btn"
                                onClick={exitOfflineMode}
                            >
                                Switch to Online
                            </button>
                        )}
                        
                        {isOnline && !isOfflineMode && (
                            <button 
                                className="cache-btn offline-btn"
                                onClick={toggleOfflineMode}
                            >
                                Test Offline Mode
                            </button>
                        )}
                        
                        {cacheInfo.hasCache && (
                            <button 
                                className="cache-btn clear-btn"
                                onClick={handleClearCache}
                            >
                                Clear Cache
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfflineIndicator;