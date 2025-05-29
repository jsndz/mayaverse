"use client";

import { MessageSquare, Video, Box, Lock, FlaskRound as Flask, Database, Users, Code, Brain } from 'lucide-react';
import AnimationWrapper, { AnimationItem } from '@/components/animation-wrapper';

const features = [
  {
    icon: <MessageSquare className="h-8 w-8 text-[#7F5AF0]" />,
    title: "Real-Time Chat",
    description: "Instant messaging with code snippets, file sharing, and thread organization."
  },
  {
    icon: <Video className="h-8 w-8 text-[#00C2FF]" />,
    title: "1v1 Video Calls",
    description: "Crystal-clear video meetings with screen sharing and recording capabilities."
  },
  {
    icon: <Box className="h-8 w-8 text-[#7F5AF0]" />,
    title: "Custom Virtual Rooms",
    description: "Create and customize spaces tailored to your team's unique workflow."
  },
  {
    icon: <Lock className="h-8 w-8 text-[#00C2FF]" />,
    title: "Auth & Access Control",
    description: "Granular permissions and secure authentication for your workspace."
  },
  {
    icon: <Flask className="h-8 w-8 text-[#7F5AF0]" />,
    title: "Test-Driven Development",
    description: "Built-in testing tools to ensure your code quality stays high."
  },
  {
    icon: <Database className="h-8 w-8 text-[#00C2FF]" />,
    title: "Full-Stack Powered",
    description: "Leverage the full power of modern web technologies and infrastructure."
  },
  {
    icon: <Users className="h-8 w-8 text-[#7F5AF0]" />,
    title: "Team Collaboration",
    description: "Multi-user editing, commenting, and real-time presence indicators."
  },
  {
    icon: <Brain className="h-8 w-8 text-[#00C2FF]" />,
    title: "AI Assistance",
    description: "Built-in AI code helpers to accelerate your development workflow."
  }
];

export function FeaturesSection() {
  return (
    <section id="features\" className="py-24 relative">
      {/* Background accent */}
      <div className="absolute top-1/2 -translate-y-1/2 -left-64 w-[500px] h-[500px] bg-[#7F5AF0]/10 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimationWrapper animation="slideUp" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">Why Mayaverse?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Designed by developers, for developers. Powerful tools that feel familiar yet revolutionary.
          </p>
        </AnimationWrapper>

        <AnimationWrapper animation="staggered" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <AnimationItem key={index}>
              <div className="p-6 rounded-xl bg-[#121212] border border-gray-800 hover:border-gray-700 transition-all duration-300 group hover:shadow-[0_0_25px_rgba(127,90,240,0.1)] h-full">
                <div className="mb-4 p-3 rounded-lg inline-block bg-gray-900/50 group-hover:bg-gray-900 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 font-space-grotesk group-hover:text-[#7F5AF0] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            </AnimationItem>
          ))}
        </AnimationWrapper>
      </div>
    </section>
  );
}