import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Zap,
  Eye,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Download,
  Share2,
  X,
  DollarSign,
  Users,
  Calendar,
  Award,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

const AIInsights = ({ fileData, chartData, onInsightGenerated }) => {
  const [insights, setInsights] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const generateInsights = () => {
    if (!fileData || !fileData.datasets || !fileData.datasets[0]) {
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate AI analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          generateDataSpecificInsights();
          return 100;
        }
        return prev + 8;
      });
    }, 150);
  };

  const generateDataSpecificInsights = () => {
    const data = fileData.datasets[0].data;
    const labels = fileData.labels;
    const metadata = fileData.metadata;
    const currentChart = chartData || {};
    
    if (!data || data.length === 0) return;

    const insights = [];

    // Calculate comprehensive statistics
    const max = Math.max(...data);
    const min = Math.min(...data);
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const maxIndex = data.indexOf(max);
    const minIndex = data.indexOf(min);
    const total = data.reduce((a, b) => a + b, 0);

    // 1. Growth/Trend Analysis
    if (data.length > 1) {
      const growth = ((data[data.length - 1] - data[0]) / data[0]) * 100;
      const recentGrowth = data.length > 2 ? ((data[data.length - 1] - data[data.length - 2]) / data[data.length - 2]) * 100 : 0;
      
      insights.push({
        id: 1,
        type: growth > 0 ? 'growth' : 'decline',
        title: growth > 0 ? 'Positive Growth Trajectory' : 'Declining Performance',
        description: `${Math.abs(growth).toFixed(1)}% ${growth > 0 ? 'increase' : 'decrease'} from ${labels[0]} to ${labels[labels.length - 1]}. Recent period shows ${Math.abs(recentGrowth).toFixed(1)}% ${recentGrowth > 0 ? 'growth' : 'decline'}.`,
        confidence: 95,
        impact: Math.abs(growth) > 20 ? 'high' : Math.abs(growth) > 10 ? 'medium' : 'low',
        icon: growth > 0 ? TrendingUp : TrendingDown,
        color: growth > 0 ? 'text-green-500' : 'text-red-500',
        bgColor: growth > 0 ? 'bg-green-500/10' : 'bg-red-500/10',
        borderColor: growth > 0 ? 'border-green-500/20' : 'border-red-500/20',
        recommendation: growth > 0 
          ? `Excellent momentum! Consider scaling successful strategies. Recent ${recentGrowth > 0 ? 'acceleration' : 'deceleration'} suggests ${recentGrowth > 0 ? 'continued optimization opportunities' : 'need for strategy review'}.`
          : `Immediate attention required. Analyze root causes and implement corrective measures. Focus on ${labels[maxIndex]} period strategies.`,
        details: {
          metric: 'Overall Growth Rate',
          value: `${growth > 0 ? '+' : ''}${growth.toFixed(1)}%`,
          period: `${labels[0]} to ${labels[labels.length - 1]}`,
          comparison: `Recent: ${recentGrowth > 0 ? '+' : ''}${recentGrowth.toFixed(1)}%`,
          chartType: `${currentChart.chartType || '2d'} ${currentChart.chartStyle || 'bar'} chart`,
          actionItems: growth > 0 
            ? ['Scale successful initiatives', 'Monitor for sustainability', 'Identify growth drivers']
            : ['Root cause analysis', 'Immediate intervention', 'Recovery planning']
        }
      });
    }

    // 2. Peak Performance Analysis
    const peakPerformance = ((max - avg) / avg) * 100;
    insights.push({
      id: 2,
      type: 'peak',
      title: 'Peak Performance Insights',
      description: `Highest performance of ${max.toLocaleString()} at ${labels[maxIndex]}, which is ${peakPerformance.toFixed(1)}% above average. This represents ${((max / total) * 100).toFixed(1)}% of total value.`,
      confidence: 100,
      impact: peakPerformance > 50 ? 'high' : peakPerformance > 25 ? 'medium' : 'low',
      icon: Award,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      recommendation: `Analyze success factors from ${labels[maxIndex]} period. ${peakPerformance > 50 ? 'Exceptional performance - replicate strategies across other periods.' : 'Good performance - identify scalable elements.'}`,
      details: {
        metric: 'Peak Value',
        value: max.toLocaleString(),
        period: labels[maxIndex],
        comparison: `${peakPerformance.toFixed(1)}% above average`,
        chartType: `Best visualized in ${currentChart.chartType || '2d'} ${currentChart.chartStyle || 'bar'} format`,
        actionItems: ['Document success factors', 'Replicate strategies', 'Set new benchmarks']
      }
    });

    // 3. Consistency Analysis
    const variance = data.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = (stdDev / avg) * 100;

    insights.push({
      id: 3,
      type: coefficientOfVariation > 30 ? 'volatility' : 'stability',
      title: coefficientOfVariation > 30 ? 'High Volatility Detected' : 'Stable Performance Pattern',
      description: `Coefficient of variation: ${coefficientOfVariation.toFixed(1)}%. ${coefficientOfVariation > 30 ? 'High volatility indicates unpredictable performance.' : 'Low volatility suggests consistent, predictable performance.'}`,
      confidence: 92,
      impact: coefficientOfVariation > 30 ? 'medium' : 'low',
      icon: coefficientOfVariation > 30 ? AlertTriangle : CheckCircle,
      color: coefficientOfVariation > 30 ? 'text-yellow-500' : 'text-green-500',
      bgColor: coefficientOfVariation > 30 ? 'bg-yellow-500/10' : 'bg-green-500/10',
      borderColor: coefficientOfVariation > 30 ? 'border-yellow-500/20' : 'border-green-500/20',
      recommendation: coefficientOfVariation > 30 
        ? 'Implement stabilization measures. Focus on process standardization and risk management.'
        : 'Maintain current operational excellence. Consider gradual optimization for growth.',
      details: {
        metric: 'Volatility Index',
        value: `${coefficientOfVariation.toFixed(1)}%`,
        period: 'Full dataset',
        comparison: `Standard deviation: ${stdDev.toFixed(2)}`,
        actionItems: coefficientOfVariation > 30 
          ? ['Risk assessment', 'Process standardization', 'Contingency planning']
          : ['Maintain standards', 'Gradual optimization', 'Best practice documentation']
      }
    });

    // 4. Opportunity Analysis
    const underperformingPeriods = data.filter((val) => val < avg * 0.8).length;
    const opportunityValue = (avg - min) * underperformingPeriods;
    
    if (underperformingPeriods > 0) {
      insights.push({
        id: 4,
        type: 'opportunity',
        title: 'Growth Opportunity Identified',
        description: `${underperformingPeriods} period${underperformingPeriods > 1 ? 's' : ''} performing below 80% of average. Potential value uplift: ${opportunityValue.toFixed(1)} units.`,
        confidence: 88,
        impact: underperformingPeriods > data.length / 3 ? 'high' : 'medium',
        icon: Target,
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-500/20',
        recommendation: `Focus improvement efforts on underperforming periods. Benchmark against ${labels[maxIndex]} strategies.`,
        details: {
          metric: 'Opportunity Value',
          value: opportunityValue.toFixed(1),
          period: `${underperformingPeriods} periods`,
          comparison: `${((underperformingPeriods / data.length) * 100).toFixed(1)}% of total periods`,
          actionItems: ['Performance gap analysis', 'Best practice transfer', 'Targeted interventions']
        }
      });
    }

    // 5. Data-Type Specific Insights
    if (metadata?.dataType) {
      switch (metadata.dataType) {
        case 'financial':
          const revenue = total;
          const avgGrowthRate = data.length > 1 ? (Math.pow(data[data.length - 1] / data[0], 1 / (data.length - 1)) - 1) * 100 : 0;
          insights.push({
            id: 5,
            type: 'financial',
            title: 'Financial Performance Analysis',
            description: `Total revenue: $${revenue.toFixed(1)}M with ${avgGrowthRate.toFixed(1)}% CAGR. ${avgGrowthRate > 15 ? 'Exceptional' : avgGrowthRate > 8 ? 'Strong' : 'Moderate'} growth trajectory.`,
            confidence: 96,
            impact: 'high',
            icon: DollarSign,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20',
            recommendation: avgGrowthRate > 15 
              ? 'Maintain growth momentum. Consider market expansion opportunities.'
              : 'Explore growth acceleration strategies. Analyze market positioning.',
            details: {
              metric: 'Compound Annual Growth Rate',
              value: `${avgGrowthRate.toFixed(1)}%`,
              period: 'Full period',
              comparison: `Total revenue: $${revenue.toFixed(1)}M`,
              actionItems: ['Revenue optimization', 'Market analysis', 'Growth strategy review']
            }
          });
          break;

        case 'user_analytics':
          const userGrowth = data.length > 1 ? ((data[data.length - 1] - data[0]) / data[0]) * 100 : 0;
          const avgUsers = avg;
          insights.push({
            id: 5,
            type: 'user_growth',
            title: 'User Engagement Analysis',
            description: `${userGrowth.toFixed(1)}% user growth with average ${avgUsers.toFixed(0)}K monthly active users. ${userGrowth > 20 ? 'Excellent' : userGrowth > 10 ? 'Good' : 'Steady'} user acquisition.`,
            confidence: 94,
            impact: userGrowth > 20 ? 'high' : 'medium',
            icon: Users,
            color: 'text-cyan-500',
            bgColor: 'bg-cyan-500/10',
            borderColor: 'border-cyan-500/20',
            recommendation: userGrowth > 20 
              ? 'Scale user acquisition channels. Focus on retention strategies.'
              : 'Optimize conversion funnel. Enhance user experience.',
            details: {
              metric: 'User Growth Rate',
              value: `${userGrowth.toFixed(1)}%`,
              period: 'Full period',
              comparison: `Avg MAU: ${avgUsers.toFixed(0)}K`,
              actionItems: ['Acquisition optimization', 'Retention analysis', 'Engagement improvement']
            }
          });
          break;

        case 'product_performance':
          const topProduct = labels[maxIndex];
          const marketShare = (max / total) * 100;
          insights.push({
            id: 5,
            type: 'product',
            title: 'Product Portfolio Analysis',
            description: `${topProduct} leads with ${marketShare.toFixed(1)}% market share (${max.toLocaleString()} units). ${marketShare > 40 ? 'Dominant position' : marketShare > 25 ? 'Strong performer' : 'Competitive position'}.`,
            confidence: 98,
            impact: marketShare > 40 ? 'high' : 'medium',
            icon: BarChart3,
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-500/10',
            borderColor: 'border-indigo-500/20',
            recommendation: marketShare > 40 
              ? 'Leverage leading position. Consider portfolio diversification.'
              : 'Strengthen competitive advantages. Analyze growth opportunities.',
            details: {
              metric: 'Market Share',
              value: `${marketShare.toFixed(1)}%`,
              period: topProduct,
              comparison: `${max.toLocaleString()} units`,
              actionItems: ['Competitive analysis', 'Portfolio optimization', 'Market expansion']
            }
          });
          break;
      }
    }

    // 6. Seasonal/Pattern Analysis
    if (data.length >= 4) {
      const seasonalVariation = Math.max(...data) / Math.min(...data);
      if (seasonalVariation > 1.5) {
        insights.push({
          id: 6,
          type: 'seasonal',
          title: 'Seasonal Pattern Detected',
          description: `${seasonalVariation.toFixed(1)}x variation between peak and trough suggests strong seasonal influence. Peak: ${labels[maxIndex]}, Trough: ${labels[minIndex]}.`,
          confidence: 85,
          impact: 'medium',
          icon: Calendar,
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/20',
          recommendation: 'Develop seasonal strategies. Plan inventory and resources around peak periods.',
          details: {
            metric: 'Seasonal Variation',
            value: `${seasonalVariation.toFixed(1)}x`,
            period: `${labels[minIndex]} to ${labels[maxIndex]}`,
            comparison: `Peak-to-trough ratio`,
            actionItems: ['Seasonal planning', 'Resource optimization', 'Demand forecasting']
          }
        });
      }
    }

    setInsights(insights);
    
    // Notify parent that insights were generated
    if (onInsightGenerated) {
      onInsightGenerated();
    }
  };

  useEffect(() => {
    if (fileData) {
      generateInsights();
    }
  }, [fileData, chartData]);

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getImpactBadge = (impact) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!fileData) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-96 text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Brain className="w-16 h-16 mb-4" />
        <p className="text-xl mb-2">AI Insights Ready</p>
        <p className="text-sm text-center max-w-md">
          Upload Excel data and generate charts to receive intelligent, data-driven insights and recommendations
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center space-x-2">
            <Brain className="w-8 h-8 text-blue-500" />
            <span>AI Insights</span>
          </h2>
          <p className="text-gray-400">Advanced analytics and intelligent recommendations for your data</p>
          {fileData.metadata && (
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>📊 {fileData.metadata.fileName}</span>
              <span>•</span>
              <span>📈 {fileData.metadata.processedRows} data points</span>
              <span>•</span>
              <span>🎯 {fileData.metadata.dataType || 'General'} analysis</span>
              {chartData && (
                <>
                  <span>•</span>
                  <span>📊 {chartData.chartType} {chartData.chartStyle} chart</span>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={generateInsights}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}</span>
          </motion.button>
        </div>
      </div>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <motion.div
          className="bg-gray-800 p-6 rounded-lg border border-blue-500/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <Brain className="w-6 h-6 text-blue-500 animate-pulse" />
            <div>
              <h3 className="font-medium">AI Analysis in Progress</h3>
              <p className="text-sm text-gray-400">Processing your data with advanced machine learning algorithms</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${analysisProgress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>{analysisProgress}% Complete</span>
            <span>
              {analysisProgress < 30 ? 'Analyzing patterns...' :
               analysisProgress < 60 ? 'Calculating statistics...' :
               analysisProgress < 90 ? 'Generating insights...' : 'Finalizing recommendations...'}
            </span>
          </div>
        </motion.div>
      )}

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            className={`bg-gray-800 p-6 rounded-lg border ${insight.borderColor} cursor-pointer hover:bg-gray-750 transition-all group`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            onClick={() => setSelectedInsight(insight)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${insight.bgColor} group-hover:scale-110 transition-transform`}>
                <insight.icon className={`w-6 h-6 ${insight.color}`} />
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs text-gray-400">Confidence</span>
                  <span className="font-bold text-white">{insight.confidence}%</span>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getImpactBadge(insight.impact)}`}>
                  {insight.impact.toUpperCase()}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">
              {insight.title}
            </h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
              {insight.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Value</p>
                  <p className="font-bold text-sm">{insight.details.value}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Period</p>
                  <p className="font-medium text-sm truncate max-w-20">{insight.details.period}</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Statistics */}
      {insights.length > 0 && (
        <motion.div
          className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 p-6 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <h3 className="text-xl font-semibold">Key Recommendations</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-blue-400">Immediate Actions</h4>
              {insights.filter(i => i.impact === 'high').slice(0, 3).map((insight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 ${insight.color.replace('text-', 'bg-')} rounded-full mt-2 flex-shrink-0`}></div>
                  <div>
                    <p className="font-medium text-sm">{insight.title}</p>
                    <p className="text-sm text-gray-400">{insight.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-green-400">Strategic Opportunities</h4>
              {insights.filter(i => i.impact === 'medium').slice(0, 3).map((insight, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 ${insight.color.replace('text-', 'bg-')} rounded-full mt-2 flex-shrink-0`}></div>
                  <div>
                    <p className="font-medium text-sm">{insight.title}</p>
                    <p className="text-sm text-gray-400">{insight.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Detailed Insight Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              className="bg-gray-800 p-6 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto border border-gray-700"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${selectedInsight.bgColor}`}>
                    <selectedInsight.icon className={`w-6 h-6 ${selectedInsight.color}`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedInsight.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-400">
                        {selectedInsight.confidence}% Confidence
                      </span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getImpactBadge(selectedInsight.impact)}`}>
                        {selectedInsight.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInsight(null)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    <span>Detailed Analysis</span>
                  </h4>
                  <p className="text-gray-300 leading-relaxed">{selectedInsight.description}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-green-500" />
                    <span>Key Metrics</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Metric</p>
                      <p className="font-bold text-lg">{selectedInsight.details.metric}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Value</p>
                      <p className="font-bold text-lg">{selectedInsight.details.value}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Period</p>
                      <p className="font-bold">{selectedInsight.details.period}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <p className="text-sm text-gray-400">Comparison</p>
                      <p className="font-bold">{selectedInsight.details.comparison}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-yellow-500" />
                    <span>Strategic Recommendation</span>
                  </h4>
                  <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-lg">
                    <p className="text-blue-300 leading-relaxed">{selectedInsight.recommendation}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Action Items</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedInsight.details.actionItems.map((item, index) => (
                      <div key={index} className="bg-gray-700 p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">{item}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export Insight</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Share Analysis</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIInsights;