import React from 'react';
import { formatCurrency } from '../services/api';

const RecommendationList = ({ analysisResults }) => {
  if (!analysisResults || !analysisResults.recommendations || analysisResults.recommendations.length === 0) {
    return <div className="card">No recommendations available</div>;
  }
  
  return (
    <div className="card">
      <h2>Recommendations</h2>
      
      {analysisResults.recommendations.map((recommendation, index) => (
        <div key={index} className="recommendation">
          <h3>Option {index + 1}: {recommendation.configuration}</h3>
          
          <div className="recommendation-details">
            <p><strong>Justification:</strong> {recommendation.justification}</p>
            
            <p><strong>Efficiency:</strong> {(recommendation.estimated_efficiency * 100).toFixed(1)}%</p>
            
            {recommendation.roi_analysis && (
              <div className="roi-details">
                <p>
                  <strong>Breakeven Point:</strong> {recommendation.roi_analysis.breakeven_months.toFixed(1)} months
                </p>
                
                <p>
                  <strong>Total Human Cost (over {analysisResults.timeline_months} months):</strong> 
                  {formatCurrency(recommendation.roi_analysis.total_human_cost)}
                </p>
                
                <p>
                  <strong>Total Robot Cost (over {analysisResults.timeline_months} months):</strong> 
                  {formatCurrency(recommendation.roi_analysis.total_robot_cost)}
                </p>
                
                <p>
                  <strong>Savings:</strong> 
                  {formatCurrency(recommendation.roi_analysis.savings)}
                </p>
                
                <p>
                  <strong>ROI:</strong> 
                  {recommendation.roi_analysis.roi_percentage.toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
      
      <div className="recommendation-summary">
        <h3>Summary</h3>
        <p>
          Based on the analysis of your process video and the provided parameters, 
          we've identified {analysisResults.recommendations.length} potential robotic automation options.
          {analysisResults.recommendations.length > 0 && (
            <> The most cost-effective option appears to be <strong>
              {analysisResults.recommendations.sort((a, b) => 
                (b.roi_analysis?.roi_percentage || 0) - (a.roi_analysis?.roi_percentage || 0)
              )[0].configuration}
            </strong>, with an ROI of {analysisResults.recommendations.sort((a, b) => 
              (b.roi_analysis?.roi_percentage || 0) - (a.roi_analysis?.roi_percentage || 0)
            )[0].roi_analysis.roi_percentage.toFixed(1)}% over {analysisResults.timeline_months} months.</>
          )}
        </p>
      </div>
    </div>
  );
};

export default RecommendationList;