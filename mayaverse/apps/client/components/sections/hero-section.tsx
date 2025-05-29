"use client";

import { Button } from '@/components/ui/button';
import AnimationWrapper, { AnimationItem } from '@/components/animation-wrapper';
import { motion } from 'framer-motion';
import { ArrowRight, Github } from 'lucide-react';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-28 w-96 h-96 bg-[#7F5AF0]/20 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-1/3 -left-28 w-96 h-96 bg-[#00C2FF]/10 rounded-full filter blur-[100px]" />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC4yIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 lg:gap-4 relative z-10">
        <AnimationWrapper 
          animation="slideUp" 
          className="flex flex-col justify-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 font-space-grotesk leading-tight">
              Build Your Own <span className="text-[#7F5AF0]">Virtual Dev Spaces</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl font-inter">
              Mayaverse is a collaborative platform for developers to create, manage, and interact in customizable virtual spaces — complete with real-time chat, video calls, and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="glow" size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Button>
              <Button variant="outline_glow" size="lg" className="flex items-center gap-2">
                <Github size={18} />
                <span>View on GitHub</span>
              </Button>
            </div>
          </motion.div>
        </AnimationWrapper>

        <AnimationWrapper 
          animation="slideLeft" 
          delay={0.2} 
          className="flex justify-center items-center lg:justify-end"
        >
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute inset-0 rounded-2xl overflow-hidden border border-gray-800 bg-[#0A0A0A] backdrop-blur-sm bg-opacity-80 shadow-[0_0_25px_rgba(127,90,240,0.15)]">
              <Image
                src="https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Developer workspace visualization"
                fill
                className="object-cover mix-blend-overlay opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#121212]/80 via-transparent to-[#7F5AF0]/10"></div>
              
              {/* Code window mockup */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-lg overflow-hidden border border-gray-700 bg-black/80 shadow-lg">
                <div className="h-6 bg-gray-900 flex items-center px-2 space-x-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="p-4 font-mono text-xs text-green-400">
                  <div className="text-gray-400">// Mayaverse - connect with devs</div>
                  <div className="mt-2">
                    <span className="text-purple-400">import</span> <span className="text-blue-400">{'{'} Space {'}'}</span> <span className="text-purple-400">from</span> <span className="text-green-400">&apos;mayaverse&apos;</span>;
                  </div>
                  <div className="mt-3">
                    <span className="text-purple-400">const</span> <span className="text-blue-400">mySpace</span> = <span className="text-purple-400">new</span> <span className="text-yellow-400">Space</span>({'{'}
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-400">name:</span> <span className="text-green-400">&apos;CodeNest&apos;</span>,
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-400">capacity:</span> <span className="text-yellow-400">12</span>,
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-400">features:</span> [<span className="text-green-400">&apos;video&apos;</span>, <span className="text-green-400">&apos;chat&apos;</span>, <span className="text-green-400">&apos;whiteboard&apos;</span>]
                  </div>
                  <div>{'}'});</div>
                  <div className="mt-3">
                    <span className="text-purple-400">await</span> <span className="text-blue-400">mySpace</span>.<span className="text-yellow-400">initialize()</span>;
                  </div>
                  <div className="mt-3 text-gray-400">// Connected! Workspace ready</div>
                  <div className="mt-1 animate-pulse">_</div>
                </div>
              </div>
            </div>
          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
}