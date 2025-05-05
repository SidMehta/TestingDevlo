import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = '/api';

/**
 * Submit analysis request to the backend
 * 
 * @param {Object} analysisData - Data for analysis
 * @param {string} analysisData.video_url - URL of the video to analyze
 * @param {number} analysisData.timeline - Timeline in months for ROI calculation
 * @param {number} analysisData.human_cost - Hourly cost of human labor
 * @param {number} analysisData.robot_cost - Additional robot cost information
 * @returns {Promise} - Promise with analysis results
 */
export const submitAnalysis = async (analysisData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze`, analysisData);
    return response.data;
  } catch (error) {
    console.error('Error submitting analysis:', error);
    throw error;
  }
};

/**
 * Validate a video URL
 * 
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidVideoUrl = (url) => {
  // Simple URL validation - could be more sophisticated in production
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Format currency values
 * 
 * @param {number} value - Value to format
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};

/**
 * Format percentage values
 * 
 * @param {number} value - Value to format
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};