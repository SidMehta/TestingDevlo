import React, { useState } from 'react';
import { isValidVideoUrl } from '../services/api';

const AnalysisForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    video_url: '',
    timeline: 24, // Default 24 months
    human_cost: 25, // Default $25/hour
    robot_cost: 0 // Additional costs
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'video_url' ? value : Number(value)
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.video_url) {
      newErrors.video_url = 'Video URL is required';
    } else if (!isValidVideoUrl(formData.video_url)) {
      newErrors.video_url = 'Please enter a valid URL';
    }
    
    if (formData.timeline <= 0) {
      newErrors.timeline = 'Timeline must be greater than 0';
    }
    
    if (formData.human_cost <= 0) {
      newErrors.human_cost = 'Human cost must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="card">
      <h2>Analysis Parameters</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="video_url">Video URL</label>
          <input
            type="text"
            id="video_url"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            placeholder="Enter URL of process video"
            disabled={isLoading}
          />
          {errors.video_url && <div className="error">{errors.video_url}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="timeline">Analysis Timeline (months)</label>
          <input
            type="number"
            id="timeline"
            name="timeline"
            value={formData.timeline}
            onChange={handleChange}
            min="1"
            max="120"
            disabled={isLoading}
          />
          {errors.timeline && <div className="error">{errors.timeline}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="human_cost">Human Labor Cost ($/hour)</label>
          <input
            type="number"
            id="human_cost"
            name="human_cost"
            value={formData.human_cost}
            onChange={handleChange}
            min="1"
            step="0.01"
            disabled={isLoading}
          />
          {errors.human_cost && <div className="error">{errors.human_cost}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="robot_cost">Additional Robot Costs ($)</label>
          <input
            type="number"
            id="robot_cost"
            name="robot_cost"
            value={formData.robot_cost}
            onChange={handleChange}
            min="0"
            step="0.01"
            disabled={isLoading}
          />
          {errors.robot_cost && <div className="error">{errors.robot_cost}</div>}
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Analyzing...' : 'Analyze Process'}
          {isLoading && <span className="loading"></span>}
        </button>
      </form>
    </div>
  );
};

export default AnalysisForm;