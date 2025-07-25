import React, { useEffect, useRef, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Chart2D = ({ data, type }) => {
  const chartRef = useRef(null);

  // Process large datasets by sampling or aggregating
  const processedData = useMemo(() => {
    console.log('Chart2D - Processing data:', data);

    if (!data || !data.labels || !data.datasets || !data.datasets[0] || !data.datasets[0].data) {
      console.log('Chart2D - Using default data');
      return {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
          label: 'Sample Data',
          data: [12, 19, 3, 5],
          backgroundColor: [
            'rgba(59, 130, 246, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
          ],
          borderColor: [
            'rgb(59, 130, 246)',
            'rgb(16, 185, 129)',
            'rgb(245, 158, 11)',
            'rgb(239, 68, 68)',
          ],
          borderWidth: 2
        }]
      };
    }

    let labels = data.labels;
    let datasets = data.datasets;

    // Handle large datasets (more than 50 data points)
    if (labels.length > 50) {
      console.log(`Chart2D - Large dataset detected: ${labels.length} points, sampling...`);
      
      if (type === 'pie') {
        // For pie charts, show top 10 values and group rest as "Others"
        const dataset = datasets[0];
        const dataWithLabels = labels.map((label, index) => ({
          label,
          value: dataset.data[index] || 0
        }));
        
        // Sort by value and take top 10
        dataWithLabels.sort((a, b) => b.value - a.value);
        const top10 = dataWithLabels.slice(0, 10);
        const others = dataWithLabels.slice(10);
        
        if (others.length > 0) {
          const othersSum = others.reduce((sum, item) => sum + item.value, 0);
          top10.push({ label: `Others (${others.length})`, value: othersSum });
        }
        
        labels = top10.map(item => item.label);
        datasets = [{
          ...dataset,
          data: top10.map(item => item.value)
        }];
      } else {
        // For bar/line charts, sample every nth point to get ~50 points
        const sampleRate = Math.ceil(labels.length / 50);
        console.log(`Chart2D - Sampling every ${sampleRate} points`);
        
        labels = labels.filter((_, index) => index % sampleRate === 0);
        datasets = datasets.map((dataset) => ({
          ...dataset,
          data: dataset.data.filter((_, index) => index % sampleRate === 0)
        }));
      }
      
      console.log(`Chart2D - Reduced to ${labels.length} points`);
    }

    // Enhanced color schemes
    const colors = [
      'rgba(59, 130, 246, 0.8)',   // Blue
      'rgba(16, 185, 129, 0.8)',   // Green
      'rgba(245, 158, 11, 0.8)',   // Yellow
      'rgba(239, 68, 68, 0.8)',    // Red
      'rgba(139, 92, 246, 0.8)',   // Purple
      'rgba(236, 72, 153, 0.8)',   // Pink
      'rgba(6, 182, 212, 0.8)',    // Cyan
      'rgba(251, 146, 60, 0.8)',   // Orange
      'rgba(34, 197, 94, 0.8)',    // Emerald
      'rgba(168, 85, 247, 0.8)',   // Violet
    ];

    const borderColors = colors.map(color => color.replace('0.8', '1'));

    return {
      labels,
      datasets: datasets.map((dataset, index) => ({
        ...dataset,
        backgroundColor: type === 'pie' 
          ? colors.slice(0, labels.length)
          : colors[index % colors.length],
        borderColor: type === 'pie'
          ? borderColors.slice(0, labels.length)
          : borderColors[index % borderColors.length],
        borderWidth: 2,
        ...(type === 'line' && {
          fill: false,
          tension: 0.4,
          pointBackgroundColor: borderColors[index % borderColors.length],
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: labels.length > 20 ? 2 : 4, // Smaller points for large datasets
        })
      }))
    };
  }, [data, type]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
          font: {
            size: 12
          },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: `${type.charAt(0).toUpperCase() + type.slice(1)} Chart${processedData.labels.length > 50 ? ' (Sampled)' : ''}`,
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold'
        },
        padding: 20
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const value = typeof context.parsed === 'object' 
              ? context.parsed.y || context.parsed 
              : context.parsed;
            return `${context.dataset.label}: ${Number(value).toLocaleString()}`;
          }
        }
      }
    },
    ...(type !== 'pie' && {
      scales: {
        x: {
          ticks: {
            color: '#9CA3AF',
            font: {
              size: 11
            },
            maxRotation: processedData.labels.length > 10 ? 45 : 0,
            callback: function(value, index) {
              const label = this.getLabelForValue(value);
              // Truncate long labels
              return label.length > 15 ? label.substring(0, 12) + '...' : label;
            }
          },
          grid: {
            color: 'rgba(156, 163, 175, 0.1)',
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: '#9CA3AF',
            font: {
              size: 11
            },
            callback: function(value) {
              return Number(value).toLocaleString();
            }
          },
          grid: {
            color: 'rgba(156, 163, 175, 0.1)',
            drawBorder: false
          }
        }
      }
    }),
    // Performance optimizations for large datasets
    animation: {
      duration: processedData.labels.length > 20 ? 500 : 1000
    },
    elements: {
      point: {
        radius: processedData.labels.length > 50 ? 1 : 3
      }
    }
  }), [type, processedData]);

  const renderChart = () => {
    try {
      console.log('Chart2D - Rendering chart with processed data:', processedData);
      
      switch (type) {
        case 'bar':
          return <Bar ref={chartRef} data={processedData} options={options} />;
        case 'line':
          return <Line ref={chartRef} data={processedData} options={options} />;
        case 'pie':
          return <Pie ref={chartRef} data={processedData} options={options} />;
        default:
          return <Bar ref={chartRef} data={processedData} options={options} />;
      }
    } catch (error) {
      console.error('Chart2D - Rendering error:', error);
      return (
        <div className="flex items-center justify-center h-full text-white">
          <div className="text-center">
            <p className="text-xl mb-2">Chart Rendering Error</p>
            <p className="text-gray-400">Failed to render {type} chart</p>
            <p className="text-sm text-gray-500 mt-2">Check console for details</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full h-96 p-4 bg-gray-900 rounded-lg border border-gray-700">
      {processedData.labels.length > 50 && (
        <div className="mb-2 text-xs text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded">
          Large dataset detected - showing sampled data for better performance
        </div>
      )}
      {renderChart()}
    </div>
  );
};

export default Chart2D;