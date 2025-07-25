import React, { useState, useEffect } from 'react';

const WelcomeBack = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showMessage = () => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 4000); // Show for 4 seconds
    };

    // Initial delay
    const initialTimer = setTimeout(() => {
      showMessage();
      // Then repeat every 8 seconds
      const interval = setInterval(showMessage, 8000);
      return () => clearInterval(interval);
    }, 9000);

    return () => clearTimeout(initialTimer);
  }, []);

  // Enhanced black and white styles
  const containerStyle = {
    position: 'fixed',
    top: '20%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    color: 'black',
    padding: '28px 42px',
    borderRadius: '12px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    zIndex: 1000,
    textAlign: 'center',
    animation: isVisible ? 'fadeInOut 4s ease-in-out forwards' : 'none',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    maxWidth: '320px',
    width: '90%',
    opacity: 0, // Start invisible (animation will handle visibility)
    backdropFilter: 'blur(4px)',
    overflow: 'hidden'
  };

  const titleStyle = {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    lineHeight: '1.3',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: '400',
    opacity: 0.8,
    lineHeight: '1.5'
  };

  const decorationStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #000000, #888888)'
  };

  return (
    <>
      {isVisible && (
        <div style={containerStyle}>
          <div style={decorationStyle} />
          <h2 style={titleStyle}>Welcome Back</h2>
          <p style={subtitleStyle}>We're glad to see you again</p>
          
          {/* Animation keyframes */}
          <style>
            {`
              @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                10% { opacity: 1; transform: translateX(-50%) translateY(0); }
                90% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
              }
            `}
          </style>
        </div>
      )}
    </>
  );
};

export default WelcomeBack;