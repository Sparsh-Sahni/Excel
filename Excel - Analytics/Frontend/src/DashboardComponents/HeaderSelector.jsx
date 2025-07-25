import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ArrowRight, BarChart3, TrendingUp, Database } from 'lucide-react';

const HeaderSelector = ({ 
  headers, 
  onSelect, 
  onClose, 
  fileName 
}) => {
  const [selectedX, setSelectedX] = useState('');
  const [selectedY, setSelectedY] = useState('');

  const handleSubmit = () => {
    if (selectedX && selectedY) {
      onSelect({ x: selectedX, y: selectedY });
    }
  };

  const isValid = selectedX && selectedY && selectedX !== selectedY;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full border border-gray-700"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Database className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Select Chart Axes</h3>
              <p className="text-sm text-gray-400">Choose columns for X and Y axes from {fileName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* X-Axis Selection */}
          <div>
            <label className="block text-sm font-medium mb-3 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>X-Axis (Categories)</span>
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {headers.map((header, index) => (
                <motion.button
                  key={`x-${index}`}
                  onClick={() => setSelectedX(header)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedX === header
                      ? 'bg-green-500/10 border-green-500 text-green-400'
                      : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium">{header}</div>
                  <div className="text-xs text-gray-400">Column {index + 1}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Y-Axis Selection */}
          <div>
            <label className="block text-sm font-medium mb-3 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span>Y-Axis (Values)</span>
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {headers.map((header, index) => (
                <motion.button
                  key={`y-${index}`}
                  onClick={() => setSelectedY(header)}
                  disabled={selectedX === header}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedY === header
                      ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                      : selectedX === header
                      ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                  }`}
                  whileHover={selectedX !== header ? { scale: 1.02 } : {}}
                  whileTap={selectedX !== header ? { scale: 0.98 } : {}}
                >
                  <div className="font-medium">{header}</div>
                  <div className="text-xs text-gray-400">
                    {selectedX === header ? 'Already selected for X-axis' : `Column ${index + 1}`}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview */}
        {selectedX && selectedY && (
          <motion.div
            className="bg-gray-700/50 p-4 rounded-lg mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="font-medium mb-2 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-purple-500" />
              <span>Chart Preview</span>
            </h4>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span>X-Axis: <strong>{selectedX}</strong></span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Y-Axis: <strong>{selectedY}</strong></span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            onClick={handleSubmit}
            disabled={!isValid}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            whileHover={isValid ? { scale: 1.05 } : {}}
            whileTap={isValid ? { scale: 0.95 } : {}}
          >
            <span>Generate Chart</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {!isValid && selectedX && selectedY && selectedX === selectedY && (
          <motion.div
            className="mt-4 p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-yellow-400 text-sm">
              Please select different columns for X and Y axes.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default HeaderSelector;