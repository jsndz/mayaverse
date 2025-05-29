"use client";

import { Button } from '@/components/ui/button';
import AnimationWrapper from '@/components/animation-wrapper';
import { Mail, Github, Twitter } from 'lucide-react';

export function ContactSection() {
  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <AnimationWrapper animation="slideUp" className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
            Feedback or Contributions?
          </h2>
          <p className="text-gray-400 mb-8">
            Got thoughts on how to improve Mayaverse or want to contribute? We'd love to hear from you. 
            Reach out directly or open an issue on GitHub.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Mail size={18} />
              <span>hello@mayaverse.dev</span>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Github size={18} />
              <span>Open an Issue</span>
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Twitter size={18} />
              <span>@mayaverse_dev</span>
            </Button>
          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
}