import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Download, 
  Settings,
  RotateCcw,
  TrendingUp,
  Image,
  FileText,
  RefreshCw
} from 'lucide-react';
import Chart2D from './Chart2D';
import Chart3D from './Chart3D';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ChartDisplay = ({ data, chart, onChartTypeChange }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const chartRef = useRef(null);

  console.log('ChartDisplay - Received data:', data);
  console.log('ChartDisplay - Current chart:', chart);

  // Use chart data if available, otherwise show message
  const currentData = data || null;
  const currentChart = chart || null;

  const chartTypes = [
    { id: '2d', label: '2D Charts', icon: BarChart3 },
    { id: '3d', label: '3D Charts', icon: RotateCcw }
  ];

  const chartStyles = [
    { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { id: 'line', label: 'Line Chart', icon: LineChart },
    { id: 'pie', label: 'Pie Chart', icon: PieChart }
  ];

  const handleChartTypeChange = (type) => {
    onChartTypeChange(type, currentChart?.chartStyle || 'bar');
  };

  const handleChartStyleChange = (style) => {
    onChartTypeChange(currentChart?.chartType || '2d', style);
  };

  const handleDownload = async (format) => {
    if (!chartRef.current) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: '#111827',
        scale: 2,
        logging: false
      });
      
      if (format === 'png') {
        const link = document.createElement('a');
        link.download = `${currentData?.metadata?.fileName || 'chart'}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 280;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`${currentData?.metadata?.fileName || 'chart'}-${Date.now()}.pdf`);
      }
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatValue = (data, operation) => {
    if (!data || data.length === 0) return 0;
    
    switch (operation) {
      case 'max':
        return Math.max(...data);
      case 'min':
        return Math.min(...data);
      case 'avg':
        return Math.round(data.reduce((a, b) => a + b, 0) / data.length);
      default:
        return 0;
    }
  };

  // Show message if no data
  if (!currentData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-96 bg-gray-800 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
            <p className="text-gray-400">Upload an Excel file to create charts</p>
          </div>
        </div>
      </div>
    );
  }

  const dataValues = currentData?.datasets?.[0]?.data || [];
  const chartType = currentChart?.chartType || '2d';
  const chartStyle = currentChart?.chartStyle || 'bar';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Chart Visualization</h2>
          <p className="text-gray-400">Interactive data visualization for your file</p>
          {currentData.metadata && (
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>📊 {currentData.metadata.fileName}</span>
              <span>•</span>
              <span>X: {currentData.metadata.xAxis}</span>
              <span>•</span>
              <span>Y: {currentData.metadata.yAxis}</span>
              <span>•</span>
              <span>{currentData.metadata.processedRows} data points</span>
              <span>•</span>
              <span className="capitalize">{chartType} {chartStyle} Chart</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings className="w-5 h-5" />
          </motion.button>
          
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => handleDownload('png')}
              disabled={isDownloading}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              whileHover={{ scale: isDownloading ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Image className="w-4 h-4" />
              <span>PNG</span>
            </motion.button>
            
            <motion.button
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              whileHover={{ scale: isDownloading ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="w-4 h-4" />
              <span>PDF</span>
            </motion.button>
          </div>
        </div>
      </div>

      {isDownloading && (
        <motion.div
          className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-lg flex items-center space-x-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
          <span className="text-blue-400">Generating download...</span>
        </motion.div>
      )}

      {/* Chart Type Settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="bg-gray-800 p-4 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Chart Type</h3>
                <div className="space-y-2">
                  {chartTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => handleChartTypeChange(type.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        chartType === type.id
                          ? 'bg-white text-black'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <type.icon className="w-5 h-5" />
                      <span>{type.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {chartType === '2d' && (
                <div>
                  <h3 className="font-medium mb-3">Chart Style</h3>
                  <div className="space-y-2">
                    {chartStyles.map((style) => (
                      <motion.button
                        key={style.id}
                        onClick={() => handleChartStyleChange(style.id)}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                          chartStyle === style.id
                            ? 'bg-white text-black'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <style.icon className="w-5 h-5" />
                        <span>{style.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart Container */}
      <motion.div
        ref={chartRef}
        className="bg-gray-900 p-6 rounded-lg min-h-[500px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${chartType}-${chartStyle}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {chartType === '2d' ? (
              <Chart2D data={currentData} type={chartStyle} />
            ) : (
              <Chart3D data={currentData} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Chart Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-gray-800 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <h4 className="text-sm text-gray-400 mb-1">Data Points</h4>
          <p className="text-2xl font-bold">{currentData?.labels?.length || 0}</p>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <h4 className="text-sm text-gray-400 mb-1">Max Value</h4>
          <p className="text-2xl font-bold">{getStatValue(dataValues, 'max').toLocaleString()}</p>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <h4 className="text-sm text-gray-400 mb-1">Min Value</h4>
          <p className="text-2xl font-bold">{getStatValue(dataValues, 'min').toLocaleString()}</p>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <h4 className="text-sm text-gray-400 mb-1 flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>Average</span>
          </h4>
          <p className="text-2xl font-bold">{getStatValue(dataValues, 'avg').toLocaleString()}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ChartDisplay;