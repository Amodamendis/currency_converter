// ================================================
// CONVERSION HISTORY COMPONENT
// ================================================
// This component displays a list of all previous
// currency conversions with a clear all feature

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ConversionHistory = ({ history, clearHistory }) => {
    
    // ================================================
    // COMPONENT RENDER
    // ================================================
    
    return (
        <div className="conversion-history">
            
            {/* HEADER SECTION */}
            <div className="history-header">
                {/* Main title for the history section */}
                <h3 className="history-title">Conversion History</h3>
                
                {/* Clear all button - only show if there are conversions */}
                {history.length > 0 && (
                    <button 
                        className="clear-history-btn" 
                        onClick={clearHistory}
                        title="Clear all conversion history"
                    >
                        Clear All <FontAwesomeIcon icon={faTrash} />
                    </button>
                )}
            </div>
            
            {/* SCROLLABLE CONTENT AREA */}
            <div className="history-content">
                
                {/* EMPTY STATE - Show when no conversions exist */}
                {history.length === 0 ? (
                    <p className="no-history">
                        No conversions yet
                        <br />
                        <small>Your currency conversions will appear here</small>
                    </p>
                    
                ) : (
                    
                    /* HISTORY LIST - Show all conversions */
                    <div className="history-list">
                        {history.map((conversion) => (
                            
                            /* INDIVIDUAL CONVERSION ITEM */
                            <div key={conversion.id} className="history-item">
                                <div className="conversion-details">
                                    
                                    {/* Main conversion text (e.g., "100 USD = 83.50 INR") */}
                                    <div className="conversion-main">
                                        {conversion.amount} {conversion.fromCurrency} = {conversion.result} {conversion.toCurrency}
                                    </div>
                                    
                                    {/* Timestamp showing when conversion was made */}
                                    <div className="conversion-time">
                                        {conversion.timestamp}
                                    </div>
                                    
                                </div>
                            </div>
                            
                        ))}
                    </div>
                    
                )}
                
            </div>
            
        </div>
    );
};

export default ConversionHistory;