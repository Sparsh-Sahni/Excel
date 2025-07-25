import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  FileSpreadsheet, 
  BarChart3, 
  User, 
  Settings,
  Clock,
  TrendingUp,
  Brain
} from 'lucide-react';

const SearchModal = ({ onClose, theme }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const mockData = [
    {
      id: 1,
      title: 'Sales Data Q4 2024',
      type: 'file',
      icon: FileSpreadsheet,
      description: 'Excel file with quarterly sales data',
      lastModified: '2 hours ago'
    },
    {
      id: 2,
      title: 'Revenue Growth Chart',
      type: 'chart',
      icon: BarChart3,
      description: 'Bar chart showing monthly revenue trends',
      lastModified: '1 day ago'
    },
    {
      id: 3,
      title: 'User Analytics Dashboard',
      type: 'dashboard',
      icon: TrendingUp,
      description: 'Interactive dashboard with user metrics',
      lastModified: '3 days ago'
    },
    {
      id: 4,
      title: 'AI Insights Report',
      type: 'insight',
      icon: Brain,
      description: 'Machine learning analysis of customer behavior',
      lastModified: '1 week ago'
    },
    {
      id: 5,
      title: 'John Doe Profile',
      type: 'user',
      icon: User,
      description: 'Admin user profile and settings',
      lastModified: '2 weeks ago'
    }
  ];

  useEffect(() => {
    if (query.trim()) {
      const filtered = mockData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults(mockData.slice(0, 3)); // Show recent items when no query
    }
  }, [query]);

  const getTypeColor = (type) => {
    switch (type) {
      case 'file': return 'text-blue-500';
      case 'chart': return 'text-green-500';
      case 'dashboard': return 'text-purple-500';
      case 'insight': return 'text-yellow-500';
      case 'user': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-20">
      <motion.div
        className={`w-full max-w-2xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-xl overflow-hidden`}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`p-4 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center space-x-3">
            <Search className={`w-5 h-5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search files, charts, users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`flex-1 bg-transparent outline-none text-lg ${
                theme === 'dark' ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
              }`}
              autoFocus
            />
            <button
              onClick={onClose}
              className={`p-1 rounded-lg ${
                theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-8 text-center">
              <Search className={`w-12 h-12 mx-auto mb-4 ${
                theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {query ? 'No results found' : 'Start typing to search...'}
              </p>
            </div>
          ) : (
            <div>
              {!query && (
                <div className={`px-4 py-2 text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400 bg-gray-750' : 'text-gray-600 bg-gray-50'
                }`}>
                  Recent
                </div>
              )}
              {results.map((result, index) => (
                <motion.div
                  key={result.id}
                  className={`p-4 ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  } transition-colors cursor-pointer border-b ${
                    theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                  } last:border-b-0`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={onClose}
                >
                  <div className="flex items-center space-x-3">
                    <result.icon className={`w-5 h-5 ${getTypeColor(result.type)}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{result.title}</p>
                      <p className={`text-sm mt-1 ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {result.description}
                      </p>
                      <div className="flex items-center space-x-1 mt-2">
                        <Clock className={`w-3 h-3 ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`} />
                        <span className={`text-xs ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {result.lastModified}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className={`p-4 border-t ${
          theme === 'dark' ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center justify-between text-sm">
            <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Press <kbd className={`px-2 py-1 rounded ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>↵</kbd> to select
            </div>
            <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              <kbd className={`px-2 py-1 rounded ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
              }`}>Esc</kbd> to close
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchModal;