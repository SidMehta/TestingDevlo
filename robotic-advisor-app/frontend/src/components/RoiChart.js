import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { formatCurrency } from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RoiChart = ({ analysisResults }) => {
  if (!analysisResults || !analysisResults.recommendations) {
    return <div className="card">No ROI data available for chart</div>;
  }
  
  // Prepare data for ROI over time chart
  const prepareRoiTimelineData = () => {
    const timeline = analysisResults.timeline_months;
    const humanHourlyCost = analysisResults.human_hourly_cost;
    
    // Calculate monthly human cost (assuming 8 hours/day, 22 days/month)
    const monthlyHumanCost = humanHourlyCost * 8 * 22;
    
    // Generate labels for each month
    const labels = Array.from({ length: timeline }, (_, i) => `Month ${i + 1}`);
    
    // Prepare datasets for each recommendation
    const datasets = analysisResults.recommendations.map((rec, index) => {
      const robotCost = rec.roi_analysis;
      const purchasePrice = robotCost.total_robot_cost - (robotCost.breakeven_months * monthlyHumanCost * 0.2); // Approximate operational cost
      
      // Calculate cumulative costs over time
      const cumulativeHumanCosts = Array.from({ length: timeline }, (_, i) => monthlyHumanCost * (i + 1));
      
      const cumulativeRobotCosts = Array.from({ length: timeline }, (_, i) => {
        // Initial cost (purchase) plus monthly operational costs
        return purchasePrice + (monthlyHumanCost * 0.2 * (i + 1));
      });
      
      // Colors for different recommendations
      const colors = ['#4caf50', '#2196f3', '#ff9800', '#f44336'];
      
      return {
        label: `Robot Option ${index + 1}: ${rec.configuration}`,
        data: cumulativeRobotCosts,
        borderColor: colors[index % colors.length],
        backgroundColor: `${colors[index % colors.length]}33`,
        borderWidth: 2,
      };
    });
    
    // Add human cost dataset
    datasets.push({
      label: 'Human Labor',
      data: Array.from({ length: timeline }, (_, i) => monthlyHumanCost * (i + 1)),
      borderColor: '#757575',
      backgroundColor: '#75757533',
      borderWidth: 2,
      borderDash: [5, 5],
    });
    
    return {
      labels,
      datasets,
    };
  };
  
  // Prepare data for ROI comparison chart
  const prepareRoiComparisonData = () => {
    const recommendations = analysisResults.recommendations;
    
    return {
      labels: recommendations.map((rec, index) => `Option ${index + 1}`),
      datasets: [
        {
          label: 'Breakeven (Months)',
          data: recommendations.map(rec => rec.roi_analysis.breakeven_months),
          backgroundColor: '#2196f3',
        },
        {
          label: 'ROI (%)',
          data: recommendations.map(rec => rec.roi_analysis.roi_percentage),
          backgroundColor: '#4caf50',
        },
      ],
    };
  };
  
  const timelineData = prepareRoiTimelineData();
  const comparisonData = prepareRoiComparisonData();
  
  const timelineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cumulative Cost Over Time',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(context.raw)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cumulative Cost ($)',
        },
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      },
    },
  };
  
  const comparisonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'ROI Comparison',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value',
        },
      },
    },
  };
  
  return (
    <div className="card">
      <h2>ROI Analysis</h2>
      
      <div className="chart-container" style={{ height: '300px', marginBottom: '30px' }}>
        <Line data={timelineData} options={timelineOptions} />
      </div>
      
      <div className="chart-container" style={{ height: '300px' }}>
        <Bar data={comparisonData} options={comparisonOptions} />
      </div>
      
      <div className="roi-summary" style={{ marginTop: '20px' }}>
        <h3>Summary</h3>
        <ul>
          {analysisResults.recommendations.map((rec, index) => (
            <li key={index}>
              <strong>{rec.configuration}:</strong> Breaks even in {rec.roi_analysis.breakeven_months.toFixed(1)} months 
              with {rec.roi_analysis.roi_percentage.toFixed(1)}% ROI over {analysisResults.timeline_months} months.
              Total savings: {formatCurrency(rec.roi_analysis.savings)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoiChart;