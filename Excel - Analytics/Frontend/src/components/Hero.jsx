import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, BarChart3, PieChart } from 'lucide-react';
import AnimatedChart from './AnimatedChart';
import CircularText from '../Reactbitzs/CircularText';
import TextPressure from '../Reactbitzs/TextPressure';


const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center lg:text-left"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl lg:text-7xl font-bold leading-tight mb-1"
          >
            <div>
              <TextPressure
                text="Transform Your "
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
                text="Excel Data!"
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
            </div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl text-gray-300 mb-8 leading-relaxed"
          >
            Upload your Excel files and instantly generate beautiful, interactive charts.
            Analyze trends, export visualizations, and make data-driven decisions with ease.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-primary flex items-center justify-center space-x-2 group"
            >
              <span>Start Analyzing</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="btn-secondary">
              Watch Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex items-center justify-center lg:justify-start space-x-8 mt-12"
          >
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-white" />
              <span className="text-sm text-gray-300">Real-time Analytics</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-white" />
              <span className="text-sm text-gray-300">Multiple Chart Types</span>
            </div>
            <div className="flex items-center space-x-2">
              <PieChart className="h-6 w-6 text-white" />
              <span className="text-sm text-gray-300">Export Options</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative"
        >



          <div className="relative z-10">
            <div className="relative">
              {/* Circular text as the base layer */}
              <CircularText
                // text="From Excel sheets to dynamic 3D visualizations DIMENSIONAL" 
                text=" — SNOITAZILAUSIV — LANOISNEMID —  CIMANYD — OT — STEEHS — LECXE —  MORF"
                onHover="speedUp"
                spinDuration={20}
                className="text-white"
              />

              {/* Chart positioned absolutely in the center with size constraints */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-160 h-160 max-w-[82%] max-h-[82%] mb-130">
                  <AnimatedChart />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-xl blur-xl"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;