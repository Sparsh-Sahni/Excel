import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BarChart3 } from 'lucide-react';
import StarBorder from '../Reactbitzs/StarBorder'


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const location = useLocation();

const handleNavClick = (sectionId) => {
  if (sectionId === 'hero') {
    // For Home button only - scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (location.pathname !== '/') {
      navigate('/');
    }
  } else {
    // Original behavior for other buttons
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
};

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 glass px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">Exceleron</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          

          <StarBorder
            as="button"
            className="custom-class"
            color="cyan"
            speed="2s"
          >
            <button 
              onClick={() => handleNavClick('hero')} 
              className="text-white hover:text-gray-300 transition-colors"
            >
              Home
            </button>
          </StarBorder>
          <StarBorder
            as="button"
            className="custom-class"
            color="cyan"
            speed="2s"
          >
            <button 
              onClick={() => handleNavClick('services')} 
              className="text-white hover:text-gray-300 transition-colors"
            >
              Services
            </button>
          </StarBorder>
          <StarBorder
            as="button"
            className="custom-class"
            color="cyan"
            speed="2s"
          >
            <button 
              onClick={() => handleNavClick('about')} 
              className="text-white hover:text-gray-300 transition-colors"
            >
              About
            </button>
          </StarBorder>
          
          
          



          <StarBorder
            as="button"
            className="bg-black"
            color="cyan"
            speed="2s"
          >
            <button onClick={handleLoginClick} className="text-white transition-colors "  >
                 Get Started
            </button>
          </StarBorder>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

    </motion.nav>
  );
};

export default Navbar;