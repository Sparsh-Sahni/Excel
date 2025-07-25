import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, CheckCircle, AlertCircle, X, Brain, Zap, FileSpreadsheet, Settings, ArrowRight } from 'lucide-react';
import * as XLSX from 'xlsx';
import HeaderSelector from './HeaderSelector';

const FileUpload = ({ onDataUpload }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [showHeaderSelector, setShowHeaderSelector] = useState(false);
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    setIsProcessing(true);
    setAiProcessing(true);
    setError(null);

    try {
      const file = acceptedFiles[0];
      setFileName(file.name);

      console.log('Processing file:', file.name);

      // Read Excel file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      console.log('Excel data parsed:', jsonData);

      if (jsonData.length === 0) {
        throw new Error('No data found in the Excel file');
      }

      if (jsonData.length < 2) {
        throw new Error('Excel file must have at least a header row and one data row');
      }

      // Store raw data and show header selector
      const processedData = {
        rawData: jsonData,
        headers: jsonData[0],
        rows: jsonData.slice(1).filter(row => row && row.length > 0) // Filter out empty rows
      };

      console.log('Processed data:', processedData);

      setExcelData(processedData);
      setIsProcessing(false);
      setAiProcessing(false);
      setShowHeaderSelector(true);

    } catch (err) {
      console.error('File processing error:', err);
      setError(err.message || 'Failed to process files. Please try again.');
      setIsProcessing(false);
      setAiProcessing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const handleHeaderSelection = (selectedHeaders) => {
    if (!excelData) {
      console.error('No excel data available');
      setError('No excel data available for processing');
      return;
    }

    console.log('Selected headers:', selectedHeaders);
    console.log('Available headers:', excelData.headers);

    const { headers, rows } = excelData;
    const xIndex = headers.indexOf(selectedHeaders.x);
    const yIndex = headers.indexOf(selectedHeaders.y);

    console.log('Header indices - X:', xIndex, 'Y:', yIndex);

    if (xIndex === -1 || yIndex === -1) {
      const errorMsg = `Selected headers not found in data. X: ${selectedHeaders.x} (index: ${xIndex}), Y: ${selectedHeaders.y} (index: ${yIndex})`;
      console.error(errorMsg);
      setError(errorMsg);
      return;
    }

    // Create chart data
    const labels = [];
    const values = [];

    console.log('Processing rows:', rows.length);

    rows.forEach((row, rowIndex) => {
      if (row && row.length > Math.max(xIndex, yIndex)) {
        const xValue = row[xIndex];
        const yValue = row[yIndex];
        
        console.log(`Row ${rowIndex}: X=${xValue}, Y=${yValue}`);

        if (xValue !== undefined && xValue !== null && xValue !== '' && 
            yValue !== undefined && yValue !== null && yValue !== '') {
          
          labels.push(String(xValue));
          
          // Convert Y value to number
          let numericValue;
          if (typeof yValue === 'number') {
            numericValue = yValue;
          } else {
            numericValue = parseFloat(String(yValue).replace(/[^0-9.-]/g, '')) || 0;
          }
          
          values.push(numericValue);
        }
      }
    });

    console.log('Final chart data - Labels:', labels, 'Values:', values);

    if (labels.length === 0 || values.length === 0) {
      const errorMsg = `No valid data found. Labels: ${labels.length}, Values: ${values.length}`;
      console.error(errorMsg);
      setError(errorMsg);
      return;
    }

    const chartData = {
      labels,
      datasets: [{
        label: selectedHeaders.y,
        data: values,
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(251, 146, 60, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
          'rgb(6, 182, 212)',
          'rgb(251, 146, 60)'
        ],
        borderWidth: 2
      }],
      metadata: {
        fileName,
        xAxis: selectedHeaders.x,
        yAxis: selectedHeaders.y,
        totalRows: rows.length,
        processedRows: labels.length,
        dataType: detectDataType(selectedHeaders.y, values)
      }
    };

    console.log('Generated chart data:', chartData);

    // Add to uploaded files
    const processedFile = {
      name: fileName,
      size: 0,
      status: 'processed',
      data: chartData,
      headers: headers,
      selectedHeaders
    };

    setUploadedFiles(prev => [...prev, processedFile]);
    setShowHeaderSelector(false);
    setError(null);
    
    // Pass data to parent component
    onDataUpload(chartData);
  };

  const detectDataType = (yAxisLabel, values) => {
    const label = yAxisLabel.toLowerCase();
    
    if (label.includes('revenue') || label.includes('sales') || label.includes('profit') || 
        label.includes('cost') || label.includes('price') || label.includes('$')) {
      return 'financial';
    }
    
    if (label.includes('user') || label.includes('customer') || label.includes('visitor') || 
        label.includes('engagement') || label.includes('retention')) {
      return 'user_analytics';
    }
    
    if (label.includes('product') || label.includes('item') || label.includes('inventory') || 
        label.includes('stock') || label.includes('unit')) {
      return 'product_performance';
    }
    
    if (label.includes('region') || label.includes('country') || label.includes('location') || 
        label.includes('territory') || label.includes('area')) {
      return 'regional_analysis';
    }
    
    return 'general';
  };

  const generateSampleData = () => {
    // Simple, guaranteed working sample data
    const sampleData = {
      labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
      datasets: [{
        label: 'Revenue (Million $)',
        data: [2.4, 3.8, 4.2, 5.1],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 2
      }],
      metadata: {
        fileName: 'quarterly-sales-2024.xlsx',
        xAxis: 'Quarter',
        yAxis: 'Revenue (Million $)',
        totalRows: 4,
        processedRows: 4,
        dataType: 'financial'
      }
    };

    console.log('Generated sample data:', sampleData);

    const sampleFile = {
      name: 'quarterly-sales-2024.xlsx',
      size: Math.floor(Math.random() * 5000) + 1000,
      status: 'processed',
      data: sampleData,
      headers: [sampleData.metadata.xAxis, sampleData.metadata.yAxis, 'Growth %', 'Target'],
      selectedHeaders: { x: sampleData.metadata.xAxis, y: sampleData.metadata.yAxis }
    };

    setUploadedFiles(prev => [...prev, sampleFile]);
    setError(null);
    console.log('FileUpload: Calling onDataUpload with sample data:', sampleData);
    onDataUpload(sampleData);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Excel File Upload</h2>
        <p className="text-gray-400">Upload your Excel files to generate interactive analytics with AI insights</p>
      </div>

      {/* Upload Zone */}
      <motion.div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-white bg-gray-800'
            : 'border-gray-600 hover:border-gray-400 hover:bg-gray-900'
        }`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input {...getInputProps()} />
        
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          
          <div>
            <p className="text-lg font-medium">
              {isDragActive ? 'Drop files here' : 'Drag & drop Excel files here'}
            </p>
            <p className="text-gray-400 mt-1">or click to select files</p>
          </div>
          
          <div className="text-sm text-gray-500">
            Supports .xlsx, .xls, .csv files
          </div>
        </motion.div>
      </motion.div>

      {/* Processing Indicator */}
      {isProcessing && (
        <motion.div
          className="bg-gray-800 p-4 rounded-lg flex items-center space-x-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <div>
            <span>Processing Excel file...</span>
            {aiProcessing && (
              <div className="flex items-center space-x-2 mt-1">
                <Brain className="w-4 h-4 text-blue-500 animate-pulse" />
                <span className="text-sm text-blue-400">Analyzing data structure</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          className="bg-red-900/20 border border-red-500 p-4 rounded-lg flex items-center space-x-3"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-400">{error}</span>
        </motion.div>
      )}

      {/* Header Selector Modal */}
      <AnimatePresence>
        {showHeaderSelector && excelData && (
          <HeaderSelector
            headers={excelData.headers}
            onSelect={handleHeaderSelection}
            onClose={() => setShowHeaderSelector(false)}
            fileName={fileName}
          />
        )}
      </AnimatePresence>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Processed Files</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>X-Axis: {file.selectedHeaders?.x}</span>
                      <span>Y-Axis: {file.selectedHeaders?.y}</span>
                      <span>{file.data?.labels?.length || 0} data points</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <motion.button
                    onClick={() => removeFile(index)}
                    className="p-1 hover:bg-gray-700 rounded"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          className="bg-gray-800 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <h4 className="font-medium mb-2">Sample Data</h4>
          <p className="text-sm text-gray-400 mb-3">Try with sample Excel data</p>
          <button 
            onClick={generateSampleData}
            className="w-full bg-white text-black py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Load Sample
          </button>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <h4 className="font-medium mb-2 flex items-center space-x-2">
            <Brain className="w-4 h-4 text-blue-500" />
            <span>AI Features</span>
          </h4>
          <p className="text-sm text-gray-400 mb-3">Automatic insights & analysis</p>
          <div className="flex items-center space-x-1 text-xs text-blue-400">
            <Zap className="w-3 h-3" />
            <span>Smart header detection</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-800 p-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
        >
          <h4 className="font-medium mb-2 flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-green-500" />
            <span>Data Mapping</span>
          </h4>
          <p className="text-sm text-gray-400 mb-3">Choose X and Y axis columns</p>
          <div className="flex items-center space-x-1 text-xs text-green-400">
            <Settings className="w-3 h-3" />
            <span>Custom configuration</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FileUpload;