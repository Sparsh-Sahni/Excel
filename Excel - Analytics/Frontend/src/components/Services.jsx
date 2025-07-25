import { motion } from 'framer-motion';
import {
  Upload, BarChart3, Download, History, Zap, Shield,
  Brain, Users, Cloud, Smartphone, Globe, Lock,
  TrendingUp, PieChart, LineChart, Database
} from 'lucide-react';

import StarBorder from '../Reactbitzs/StarBorder'

import TextPressure from '../Reactbitzs/TextPressure';
const mainServices = [
  {
    icon: Upload,
    title: 'Smart File Upload',
    description: 'Advanced drag-and-drop interface with support for Excel, CSV, Google Sheets, and 50+ file formats. Automatic data validation and error detection.',
    features: ['Multi-format support', 'Batch processing', 'Auto-validation', 'Error detection']
  },
  {
    icon: BarChart3,
    title: 'AI-Powered Visualizations',
    description: 'Generate stunning 2D and 3D charts with AI recommendations. Interactive dashboards with real-time updates and custom styling options.',
    features: ['15+ chart types', '3D visualizations', 'AI recommendations', 'Real-time updates']
  },
  {
    icon: Brain,
    title: 'Intelligent Insights',
    description: 'Machine learning algorithms automatically detect patterns, trends, and anomalies in your data. Get actionable insights without manual analysis.',
    features: ['Pattern detection', 'Trend analysis', 'Anomaly alerts', 'Predictive modeling']
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share dashboards, collaborate in real-time, and manage permissions. Built-in commenting and version control for seamless teamwork.',
    features: ['Real-time collaboration', 'Permission management', 'Version control', 'Team comments']
  },
  {
    icon: Download,
    title: 'Advanced Export',
    description: 'Export visualizations in multiple formats including PNG, PDF, SVG, and interactive HTML. Automated report generation and scheduling.',
    features: ['Multiple formats', 'Scheduled reports', 'Custom branding', 'API integration']
  },
  {
    icon: Cloud,
    title: 'Cloud Integration',
    description: 'Seamlessly connect with Google Drive, Dropbox, OneDrive, and 100+ cloud services. Automatic data synchronization and backup.',
    features: ['100+ integrations', 'Auto-sync', 'Cloud backup', 'API connections']
  },
];

const additionalFeatures = [
  {
    icon: History,
    title: 'Advanced History',
    description: 'Comprehensive analysis history with search, filtering, and project organization.',
  },
  {
    icon: Zap,
    title: 'Lightning Performance',
    description: 'Process files up to 1GB in seconds with our optimized cloud infrastructure.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliance, end-to-end encryption, and advanced access controls.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description: 'Fully responsive design with native mobile apps for iOS and Android.',
  },
  {
    icon: Globe,
    title: 'Global Scale',
    description: 'Multi-language support with data centers in 15+ regions worldwide.',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'GDPR compliant with zero data retention and complete user control.',
  },
];

const chartTypes = [
  { icon: BarChart3, name: 'Bar Charts', description: 'Compare categories and values' },
  { icon: LineChart, name: 'Line Charts', description: 'Track trends over time' },
  { icon: PieChart, name: 'Pie Charts', description: 'Show proportions and percentages' },
  { icon: TrendingUp, name: 'Scatter Plots', description: 'Analyze correlations' },
  { icon: Database, name: 'Heatmaps', description: 'Visualize data density' },
  { icon: BarChart3, name: '3D Charts', description: 'Interactive 3D visualizations' },
];

const integrations = [
  'Google Sheets', 'Microsoft Excel', 'Salesforce', 'HubSpot', 'Slack', 'Zapier',
  'Tableau', 'Power BI', 'Google Analytics', 'Shopify', 'WordPress', 'Notion'
];

const Services = () => {
  return (
    <section id="services" className="py-20 px-6 pb-0">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >

          <h2 className=" flex justify-center item-center">
            <span className="w-100 mb-12">
              <TextPressure
                className='mb-0 pb-0'
                text="Comprehensive Analytics "
                flex={true}
                alpha={false}
                stroke={true}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                strokeColor="#FFC629"
                minFontSize={36}
              />
              <TextPressure
                text="Platform Features"
                flex={true}
                alpha={false}
                stroke={true}
                width={true}
                weight={true}
                italic={true}
                textColor="#ffffff"
                strokeColor="#FFC629"
                minFontSize={36}
              />
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Everything you need to transform raw data into actionable insights. From simple uploads
            to advanced AI-powered analytics, we've got you covered with enterprise-grade features.
          </p>
        </motion.div>

        {/* Main Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {mainServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="card group cursor-pointer h-full"
            >
              <div className="mb-6">
                <div className="flex items-center justify-center w-16 h-16 bg-white/5 rounded-xl mb-4 group-hover:bg-white/10 transition-all duration-300">
                  <service.icon className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{service.title}</h3>
                <p className="text-gray-300 leading-relaxed mb-4">{service.description}</p>
              </div>

              <div className="mt-auto">
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-white/10 text-white text-xs rounded-full border border-white/20"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Types */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="flex justify-center item center ">
            <span className='w-100'><TextPressure
              className='mb-0 pb-0'
              text="Supported Charts"
              flex={true}
              alpha={false}
              stroke={true}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#FFC629"
              minFontSize={16}
            /></span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {chartTypes.map((chart, index) => (
              <motion.div
                key={chart.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 bg-secondary/30 rounded-xl border border-border hover:border-white/20 transition-all duration-300 group"
              >
                <chart.icon className="h-8 w-8 text-white mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                <h4 className="text-white font-medium mb-1 text-sm">{chart.name}</h4>
                <p className="text-gray-400 text-xs">{chart.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="flex justify-center item center ">
            <span className='w-100'><TextPressure
              className='mb-0 pb-0'
              text="Additional Features"
              flex={true}
              alpha={false}
              stroke={true}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#FFC629"
              minFontSize={16}
            /></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4 p-6 bg-secondary/30 rounded-xl border border-border hover:border-white/20 transition-all duration-300 group"
              >
                <div className="flex-shrink-0 p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
                  <p className="text-gray-300 text-sm">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="flex justify-center item center ">
            <span className='w-100'><TextPressure
              className='mb-0 pb-0'
              text="Popular Integrations"
              flex={true}
              alpha={false}
              stroke={true}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#FFC629"
              minFontSize={16}
            /></span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="px-4 py-2 bg-white/10 text-white rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer"
              >
                {integration}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing Tiers */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="flex justify-center item center mb-10">
            <span className='w-100'><TextPressure
              className='mb-0 pb-0'
              text="Choose Your Plan"
              flex={true}
              alpha={false}
              stroke={true}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#FFC629"
              minFontSize={16}
            /></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: 'Free',
                description: 'Perfect for individuals and small projects',
                features: ['5 files per month', 'Basic charts', 'PNG export', 'Email support']
              },
              {
                name: 'Professional',
                price: '$29/month',
                description: 'Ideal for growing teams and businesses',
                features: ['Unlimited files', 'All chart types', 'All export formats', 'Priority support', 'Team collaboration'],
                popular: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'Advanced features for large organizations',
                features: ['Custom integrations', 'Advanced security', 'Dedicated support', 'SLA guarantee', 'Custom branding']
              }
            ].map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-8 rounded-2xl border transition-all duration-300 ${plan.popular
                  ? 'bg-white/5 border-white scale-105'
                  : 'bg-secondary/30 border-border hover:border-white/20'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-white text-black text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                  <div className="text-3xl font-bold text-white mb-2">{plan.price}</div>
                  <p className="text-gray-300 text-sm">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${plan.popular
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}>
                  {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mb-0"
        >
          <div className="glass rounded-2xl p-12">
            <h3 className="text-3xl font-bold mb-6 text-white">
              Ready to Supercharge Your Analytics?
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Join over 50,000 users who trust ExcelAnalytics for their data visualization needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-white text-lg px-8 py-4">
                Start Free Trial
              </button>
              <button className="btn-secondary text-white text-lg px-8 py-4">
                View Live Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;