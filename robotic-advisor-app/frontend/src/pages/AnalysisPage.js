import React, { useState } from 'react';
import AnalysisForm from '../components/AnalysisForm';
import ProcessDiagram from '../components/ProcessDiagram';
import RoiChart from '../components/RoiChart';
import RecommendationList from '../components/RecommendationList';
import { submitAnalysis } from '../services/api';

const AnalysisPage = () => {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('recommendations');
  
  const handleAnalysisSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await submitAnalysis(formData);
      setAnalysisResults(results);
    } catch (err) {
      setError('An error occurred while analyzing the process. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderTabContent = () => {
    if (!analysisResults) {
      return (
        <div className="card">
          <p>Submit a video for analysis to see recommendations and insights.</p>
        </div>
      );
    }
    
    switch (activeTab) {
      case 'recommendations':
        return <RecommendationList analysisResults={analysisResults} />;
      case 'diagram':
        return <ProcessDiagram analysisResults={analysisResults} />;
      case 'roi':
        return <RoiChart analysisResults={analysisResults} />;
      default:
        return <RecommendationList analysisResults={analysisResults} />;
    }
  };
  
  return (
    <div>
      <AnalysisForm onSubmit={handleAnalysisSubmit} isLoading={isLoading} />
      
      {error && (
        <div className="card error-card">
          <p className="error">{error}</p>
        </div>
      )}
      
      {analysisResults && (
        <div>
          <div className="tabs">
            <div 
              className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
              onClick={() => setActiveTab('recommendations')}
            >
              Recommendations
            </div>
            <div 
              className={`tab ${activeTab === 'diagram' ? 'active' : ''}`}
              onClick={() => setActiveTab('diagram')}
            >
              Process Diagram
            </div>
            <div 
              className={`tab ${activeTab === 'roi' ? 'active' : ''}`}
              onClick={() => setActiveTab('roi')}
            >
              ROI Analysis
            </div>
          </div>
          
          {renderTabContent()}
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;