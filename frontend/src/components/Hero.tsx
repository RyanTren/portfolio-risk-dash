// import React from 'react';
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';
import { Button } from "../components/ui/button";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-red-600/70 via-green-600/95 end-green-500/50 text-white py-24 px-4 rounded-3xl mx-4">
      {/* Animated stock market graph background */}
      <div className="absolute inset-0 overflow-hidden opacity-35">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Sharp line chart 1 */}
          <motion.path
            d="M0,300 L200,150 L400,200 L600,120 L800,180 L1000,100 L1200,160 L1400,80 L1600,140 L1800,90 L2000,120"
            fill="none"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ 
              pathLength: { duration: 2, ease: "easeInOut" },
              opacity: { duration: 3, repeat: Infinity },
            }}
          />
          
          {/* Sharp line chart 2 */}
          <motion.path
            d="M0,400 L250,450 L500,380 L750,420 L1000,350 L1250,390 L1500,340 L1750,370 L2000,320"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ 
              pathLength: { duration: 2, delay: 0.3, ease: "easeInOut" },
              opacity: { duration: 4, repeat: Infinity, delay: 0.3 },
            }}
          />
          
          {/* Sharp line chart 3 */}
          <motion.path
            d="M0,250 L180,200 L360,260 L540,190 L720,240 L900,170 L1080,220 L1260,160 L1440,210 L1620,150 L1800,190 L2000,140"
            fill="none"
            stroke="white"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: [0.45, 0.75, 0.45],
            }}
            transition={{ 
              pathLength: { duration: 2, delay: 0.6, ease: "easeInOut" },
              opacity: { duration: 5, repeat: Infinity, delay: 0.6 },
            }}
          />
        </svg>
        
        {/* Animated floating numbers */}
        {[
          { value: '+12.5%', x: '10%', delay: 0, color: 'text-green-300' },
          { value: '-8.2%', x: '25%', delay: 1, color: 'text-red-300' },
          { value: '+5.7%', x: '45%', delay: 2, color: 'text-green-300' },
          { value: '-3.4%', x: '65%', delay: 0.5, color: 'text-red-300' },
          { value: '+15.9%', x: '80%', delay: 1.5, color: 'text-green-300' },
          { value: '-11.1%', x: '35%', delay: 2.5, color: 'text-red-300' },
          { value: '+7.3%', x: '55%', delay: 3, color: 'text-green-300' },
          { value: '-6.8%', x: '75%', delay: 0.8, color: 'text-red-300' },
          { value: '+22.4%', x: '15%', delay: 3.5, color: 'text-green-300' },
          { value: '-14.6%', x: '90%', delay: 1.2, color: 'text-red-300' },
        ].map((num, i) => (
          <motion.div
            key={i}
            className={`absolute text-2xl font-bold ${num.color}`}
            style={{ left: num.x, top: '20%' }}
            initial={{ opacity: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [0, -100],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: num.delay,
              ease: "easeOut"
            }}
          >
            {num.value}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto">
        {/* Badge with animated border */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <div className="relative inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
            {/* Animated border */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.27), transparent)',
              }}
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 2.25,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <div className="absolute inset-0 rounded-full border border-white/30" />
            <Sparkles className="w-4 h-4 relative z-10" />
            <span className="text-sm font-medium relative z-10">AI-Powered Risk Management</span>
          </div>
        </motion.div>

        {/* Main heading with stagger animation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 text-center"
        >
          <span className="inline-block">
            #1 AI FRM Tool
          </span>
          <br />
          <span className="bg-gradient-to-r from-white via-green-200 to-white bg-clip-text text-transparent inline-block">
            Made Simple
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl mb-10 text-center max-w-3xl mx-auto text-white/90"
        >
          Analyze portfolio risk, run stress test simulations in real-time, and understand exposures through modern analytics and AI-assistance.
        </motion.p>

        

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {/* Primary CTA - Gradient with border glow */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate('/upload')}
              className="relative px-8 py-4 bg-gradient-to-r from-green-400 to-green-700 hover:from-green-800 hover:to-grenn-900 text-white rounded-full font-regular text-lg ring-1 hover:ring-2 hover:ring-white-400/70 transition-all duration-300 flex items-center gap-2 overflow-hidden border-0"
            >
              {/* Animated gradient overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12"
                initial={{ x: '-200%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <Zap className="w-5 h-5" fill="currentColor" />
              </span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature Pills with animated borders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap gap-4 justify-center mt-12"
        >
          {[
            { icon: Shield, text: "Enterprise Security" },
            { icon: TrendingUp, text: "Real-time Analytics" },
            { icon: Sparkles, text: "AI Insights" }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1, y: -5 }}
              className="relative flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full overflow-hidden"
            >
              {/* Animated border gradient */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                }}
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 0.3
                }}
              />
              <div className="absolute inset-0 rounded-full border border-white/20" />
              <feature.icon className="w-4 h-4 relative z-10" />
              <span className="text-sm font-medium relative z-10">{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 100],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}