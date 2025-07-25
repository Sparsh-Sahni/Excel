import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import * as THREE from 'three';

const BarChart3D = ({ data, isLargeDataset }) => {
  const groupRef = useRef(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  const { bars, maxValue } = useMemo(() => {
    // Default data if none provided
    let values = [12, 19, 3, 5];
    let labels = ['Q1', 'Q2', 'Q3', 'Q4'];

    if (data?.datasets?.[0]?.data && data?.labels) {
      values = [...data.datasets[0].data];
      labels = [...data.labels];
    }

    // Handle large datasets by sampling or grouping
    if (values.length > 20) {
      console.log(`Chart3D - Large dataset: ${values.length} points, sampling to 20...`);
      
      const sampleRate = Math.ceil(values.length / 20);
      values = values.filter((_, index) => index % sampleRate === 0);
      labels = labels.filter((_, index) => index % sampleRate === 0);
      
      console.log(`Chart3D - Reduced to ${values.length} points`);
    }

    const maxValue = Math.max(...values, 1); // Ensure maxValue is at least 1
    
    const bars = values.map((value, index) => {
      const x = (index - labels.length / 2) * (isLargeDataset ? 1.5 : 2.5);
      const height = Math.max((value / maxValue) * 6, 0.2);
      const hue = 0.6 - (index / labels.length) * 0.4;
      const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
      
      return {
        position: [x, height / 2, 0],
        height,
        color,
        value,
        label: labels[index],
        index
      };
    });

    return { bars, maxValue };
  }, [data, isLargeDataset]);

  return (
    <group ref={groupRef}>
      {bars.map((bar) => (
        <group key={bar.index} position={bar.position}>
          <Box args={[isLargeDataset ? 1.2 : 1.8, bar.height, isLargeDataset ? 1.2 : 1.8]}>
            <meshStandardMaterial 
              color={bar.color} 
              roughness={0.3}
              metalness={0.1}
            />
          </Box>
          
          {/* Value label on top */}
          <Text
            position={[0, bar.height / 2 + 0.5, 0]}
            fontSize={isLargeDataset ? 0.25 : 0.35}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {bar.value.toLocaleString()}
          </Text>
          
          {/* Category label at bottom */}
          <Text
            position={[0, -bar.height / 2 - 0.8, 0]}
            fontSize={isLargeDataset ? 0.2 : 0.25}
            color="#cccccc"
            anchorX="center"
            anchorY="middle"
            maxWidth={isLargeDataset ? 1.5 : 2}
          >
            {bar.label.length > 8 ? bar.label.substring(0, 6) + '...' : bar.label}
          </Text>
        </group>
      ))}
      
      <gridHelper 
        args={[Math.max(bars.length * 2, 10), 10, '#333333', '#222222']} 
        position={[0, -0.1, 0]} 
      />
    </group>
  );
};

const Chart3D = ({ data }) => {
  console.log('Chart3D - Received data:', data);

  const isLargeDataset = data?.labels?.length > 20;

  return (
    <div className="w-full h-96 bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden relative border border-gray-700">
      {isLargeDataset && (
        <div className="absolute top-2 left-2 z-10 text-xs text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded">
          Large dataset - showing sampled data
        </div>
      )}
      
      <Canvas 
        camera={{ position: [12, 8, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8} 
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, 5, -10]} intensity={0.3} color="#4f46e5" />
        <pointLight position={[10, 5, 10]} intensity={0.3} color="#06b6d4" />
        
        <BarChart3D data={data} isLargeDataset={isLargeDataset} />
        
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true}
          maxDistance={25}
          minDistance={5}
          maxPolarAngle={Math.PI / 2.2}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
      
      <div className="absolute bottom-4 left-4 text-white text-sm bg-black/70 px-3 py-2 rounded-lg">
        <div className="flex items-center space-x-3 text-xs">
          <span>🖱️ Drag to rotate</span>
          <span>🔍 Scroll to zoom</span>
          <span>📊 {data?.labels?.length || 4} points</span>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 text-white text-xs bg-black/70 px-3 py-1 rounded-lg">
        3D Visualization
      </div>
    </div>
  );
};

export default Chart3D;