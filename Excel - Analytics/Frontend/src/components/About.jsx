import { motion } from 'framer-motion';
import { Target, Users, Award, Lightbulb, Globe, Shield, Zap, Heart } from 'lucide-react';

import TextPressure from '../Reactbitzs/TextPressure';

const stats = [
  { number: '50K+', label: 'Files Analyzed' },
  { number: '2,500+', label: 'Happy Users' },
  { number: '99.9%', label: 'Uptime' },
  { number: '24/7', label: 'Support' },
];

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To democratize data visualization and make advanced analytics accessible to everyone, regardless of technical expertise. We believe that powerful insights should be just a click away.',
  },
  {
    icon: Users,
    title: 'Our Team',
    description: 'A passionate group of data scientists, developers, and designers from top tech companies, committed to building the most intuitive analytics platform in the world.',
  },
  {
    icon: Award,
    title: 'Our Achievement',
    description: 'Winner of the 2024 Data Innovation Award, recognized by TechCrunch as "Best Analytics Tool" and trusted by Fortune 500 companies worldwide.',
  },
  {
    icon: Lightbulb,
    title: 'Our Innovation',
    description: 'Pioneering AI-powered data insights, real-time collaboration features, and cutting-edge visualization techniques that transform how teams work with data.',
  },
];

const features = [
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Serving users in 150+ countries with multi-language support and localized data formats.',
    metric: '150+ Countries'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 Type II certified with end-to-end encryption and GDPR compliance.',
    metric: 'SOC 2 Certified'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Process files up to 100MB in under 3 seconds with our optimized cloud infrastructure.',
    metric: '<3s Processing'
  },
  {
    icon: Heart,
    title: 'Customer Love',
    description: 'Rated 4.9/5 stars with 98% customer satisfaction and industry-leading support.',
    metric: '4.9/5 Rating'
  },
];

const timeline = [
  {
    year: '2022',
    title: 'Founded',
    description: 'Started with a vision to simplify data visualization for everyone.'
  },
  {
    year: '2023',
    title: 'Series A',
    description: 'Raised $10M to expand our platform and team globally.'
  },
  {
    year: '2024',
    title: 'AI Integration',
    description: 'Launched AI-powered insights and automated chart recommendations.'
  },
  {
    year: '2025',
    title: 'Enterprise',
    description: 'Expanding enterprise features with advanced collaboration tools.'
  },
];

const About = () => {
  return (
    <section id="about" className="py-20 px-6 pb-0">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            About

            <h2 className="flex justify-center item center ">
              <span className='w-100'><TextPressure
                className='mb-0 pb-0'
                text="Excel Analytics"
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
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We're revolutionizing how businesses interact with their data. Founded by former data scientists
            from Google and Microsoft, we've built the most intuitive analytics platform that transforms
            complex spreadsheets into actionable insights in seconds.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-gray-300 text-sm lg:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card group hover:border-white/20"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors duration-300">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {value.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center text-white mb-12">Why Choose ExcelAnalytics?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-secondary/50 rounded-xl border border-border hover:border-white/20 transition-all duration-300 group"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mx-auto mb-4 group-hover:bg-white/10 transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-300 text-sm mb-3">{feature.description}</p>
                <div className="text-white font-bold text-lg">{feature.metric}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
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
              text="Our Journey"
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
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-white to-gray-600"></div>
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
              >
                <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                  <div className="bg-secondary border border-border rounded-xl p-6">
                    <div className="text-2xl font-bold text-white mb-2">{item.year}</div>
                    <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                    <p className="text-gray-300">{item.description}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full border-4 border-black"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="glass rounded-2xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-6 text-white">
              Ready to Transform Your Data Journey?
            </h3>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Join thousands of data professionals who have already discovered the power of
              intelligent analytics. Start your free trial today and see why we're the
              fastest-growing analytics platform in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg px-8 py-4">
                Start Free Trial
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;