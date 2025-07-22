import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { X, Shuffle, RotateCcw, Download, Save } from 'lucide-react';
import { AvatarConfig } from '../../types/avatar';
import Avatar3D from './Avatar3D';

interface AvatarBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: AvatarConfig) => void;
  initialConfig?: AvatarConfig;
}

const defaultConfig: AvatarConfig = {
  id: '',
  style: 'stylized3d',
  appearance: {
    skinTone: '#F4C2A1',
    hair: {
      style: 'short-casual',
      color: '#8B4513',
      texture: 'straight'
    },
    eyes: {
      shape: 'almond',
      color: '#4A4A4A',
      size: 1.0
    },
    nose: {
      shape: 'average',
      size: 1.0
    },
    mouth: {
      shape: 'neutral',
      size: 1.0
    },
    eyebrows: {
      style: 'natural',
      thickness: 1.0
    },
    bodyType: {
      build: 'average'
    }
  },
  clothing: {
    top: 'casual-tshirt',
    bottom: 'jeans',
    colors: ['#4A90E2', '#2C3E50']
  },
  accessories: {
    glasses: undefined,
    hat: undefined,
    jewelry: [],
    other: []
  },
  background: {
    type: 'gradient',
    colors: ['#667eea', '#764ba2']
  },
  props: []
};

function AvatarBuilder({ isOpen, onClose, onSave, initialConfig }: AvatarBuilderProps) {
  const [config, setConfig] = useState<AvatarConfig>(initialConfig || defaultConfig);
  const [activeTab, setActiveTab] = useState('body');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!isOpen) return null;

  const updateConfig = (path: string, value: any) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      const keys = path.split('.');
      let current: any = newConfig;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return newConfig;
    });
  };

  const randomizeAvatar = () => {
    const skinTones = ['#F4C2A1', '#E8B887', '#D4A574', '#C89666', '#B08654', '#8B6F47', '#6B4423'];
    const hairColors = ['#000000', '#2C1B18', '#8B4513', '#D2691E', '#DAA520', '#B22222', '#800080'];
    const hairStyles = ['short-casual', 'long-wavy', 'curly-afro', 'pixie-cut', 'bob', 'braided'];
    
    setConfig(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        skinTone: skinTones[Math.floor(Math.random() * skinTones.length)],
        hair: {
          ...prev.appearance.hair,
          style: hairStyles[Math.floor(Math.random() * hairStyles.length)],
          color: hairColors[Math.floor(Math.random() * hairColors.length)]
        }
      }
    }));
  };

  const resetToDefault = () => {
    setConfig(defaultConfig);
  };

  const handleSave = () => {
    const configWithId = { ...config, id: crypto.randomUUID() };
    onSave(configWithId);
    onClose();
  };

  const exportAvatar = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'my-avatar.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const tabs = [
    { id: 'body', label: 'Body', icon: '👤' },
    { id: 'hair', label: 'Hair', icon: '💇' },
    { id: 'face', label: 'Face', icon: '😊' },
    { id: 'clothing', label: 'Clothing', icon: '👕' },
    { id: 'accessories', label: 'Accessories', icon: '👓' },
    { id: 'background', label: 'Background', icon: '🎨' }
  ];

  const skinTones = [
    '#F4C2A1', '#E8B887', '#D4A574', '#C89666', 
    '#B08654', '#8B6F47', '#6B4423', '#4A2C17'
  ];

  const hairColors = [
    '#000000', '#2C1B18', '#8B4513', '#D2691E', 
    '#DAA520', '#B22222', '#800080', '#4169E1'
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'body':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Skin Tone</label>
              <div className="grid grid-cols-4 gap-2">
                {skinTones.map((tone) => (
                  <button
                    key={tone}
                    onClick={() => updateConfig('appearance.skinTone', tone)}
                    className={`w-12 h-12 rounded-full border-4 transition ${
                      config.appearance.skinTone === tone 
                        ? 'border-blue-500 scale-110' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: tone }}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Body Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['slim', 'athletic', 'average', 'curvy', 'broad'].map((build) => (
                  <button
                    key={build}
                    onClick={() => updateConfig('appearance.bodyType.build', build)}
                    className={`p-3 rounded-lg border-2 transition capitalize ${
                      config.appearance.bodyType?.build === build
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {build}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'hair':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Hair Color</label>
              <div className="grid grid-cols-4 gap-2">
                {hairColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => updateConfig('appearance.hair.color', color)}
                    className={`w-12 h-12 rounded-full border-4 transition ${
                      config.appearance.hair.color === color 
                        ? 'border-blue-500 scale-110' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Hair Style</label>
              <div className="grid grid-cols-2 gap-2">
                {['short-casual', 'long-wavy', 'curly-afro', 'pixie-cut', 'bob', 'braided'].map((style) => (
                  <button
                    key={style}
                    onClick={() => updateConfig('appearance.hair.style', style)}
                    className={`p-3 rounded-lg border-2 transition ${
                      config.appearance.hair.style === style
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {style.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Hair Texture</label>
              <div className="grid grid-cols-2 gap-2">
                {['straight', 'wavy', 'curly', 'coily'].map((texture) => (
                  <button
                    key={texture}
                    onClick={() => updateConfig('appearance.hair.texture', texture)}
                    className={`p-3 rounded-lg border-2 transition capitalize ${
                      config.appearance.hair.texture === texture
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {texture}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'clothing':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Top</label>
              <div className="grid grid-cols-2 gap-2">
                {['casual-tshirt', 'button-shirt', 'hoodie', 'blazer', 'tank-top'].map((top) => (
                  <button
                    key={top}
                    onClick={() => updateConfig('clothing.top', top)}
                    className={`p-3 rounded-lg border-2 transition ${
                      config.clothing.top === top
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {top.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Bottom</label>
              <div className="grid grid-cols-2 gap-2">
                {['jeans', 'chinos', 'shorts', 'skirt', 'dress-pants'].map((bottom) => (
                  <button
                    key={bottom}
                    onClick={() => updateConfig('clothing.bottom', bottom)}
                    className={`p-3 rounded-lg border-2 transition ${
                      config.clothing.bottom === bottom
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {bottom.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-gray-500">More customization options coming soon!</div>;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <h2 className="text-2xl font-semibold text-gray-900">Create Your Avatar</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={randomizeAvatar}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Shuffle className="w-4 h-4" />
              Randomize
            </button>
            <button
              onClick={resetToDefault}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Customization Options */}
          <div className="w-80 border-r bg-gray-50 overflow-y-auto">
            {/* Tab Navigation */}
            <div className="p-4 border-b">
              <div className="grid grid-cols-3 gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-3 rounded-lg text-sm font-medium transition ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-lg mb-1">{tab.icon}</div>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4">
              {renderTabContent()}
            </div>
          </div>

          {/* Center Panel - Avatar Preview */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-gradient-to-br from-gray-100 to-gray-200 relative">
              <Canvas
                ref={canvasRef}
                camera={{ position: [0, 0, 5], fov: 50 }}
                className="w-full h-full"
              >
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} />
                <Avatar3D config={config} />
                <OrbitControls 
                  enableZoom={true} 
                  enablePan={false}
                  minPolarAngle={Math.PI / 4}
                  maxPolarAngle={Math.PI / 1.5}
                />
              </Canvas>
              
              {/* Overlay Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={exportAvatar}
                  className="p-2 bg-white/90 rounded-lg shadow-lg hover:bg-white transition"
                  title="Export Avatar"
                >
                  <Download className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="p-6 border-t bg-white flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Style: {config.style.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Save className="w-4 h-4" />
                  Save Avatar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvatarBuilder;