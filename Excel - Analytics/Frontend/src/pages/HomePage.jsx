// import { motion } from 'framer-motion';


// const HomePage = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.5 }}
//       className="min-h-screen bg-black"
//     >
//     </motion.div>
//   );
// };

// export default HomePage;


















import React from 'react'
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';
import Particles from '../Reactbitzs/Particles';
import { motion } from 'framer-motion';
import Hero from '../components/Hero';
import Services from '../components/Services';
import About from '../components/About';
import Footer from '../components/Footer';
import SplashCursor from '../Reactbitzs/SplashCursor'

const HomePage = () => {
  return (
    <div className='bg-black  relative'>
      <SplashCursor />
      <div className='bg-black w-screen h-screen fixed top-0 left-0 z-0'>
        <Particles
          particleColors={['#FFD500', '#FFD500']}
          particleCount={900}
          particleSpread={10}
          speed={0.2}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>
      <div className='relative z-10'>
        <Navbar/>
        <Hero />
        <Services />
        <About />
        <Footer />
        {/* Add more components here - they'll all appear over the particles */}
      </div>
    </div>
  );
};

export default HomePage;