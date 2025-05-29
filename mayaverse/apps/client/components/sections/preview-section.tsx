"use client";

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnimationWrapper from '@/components/animation-wrapper';
import { cn } from '@/lib/utils';

const previewImages = [
  {
    src: "https://images.pexels.com/photos/8294606/pexels-photo-8294606.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Team collaboration in Mayaverse",
    caption: "Team collaboration features with real-time presence"
  },
  {
    src: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Code editor integration",
    caption: "Seamless code editor integration"
  },
  {
    src: "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    alt: "Virtual meeting room",
    caption: "Virtual meeting spaces with custom backgrounds"
  }
];

export function PreviewSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % previewImages.length);
  };
  
  const prevSlide = () => {
    setActiveIndex((current) => (current === 0 ? previewImages.length - 1 : current - 1));
  };

  return (
    <section id="preview" className="py-24 relative">
      {/* Background accent */}
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[400px] h-[400px] bg-[#00C2FF]/10 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <AnimationWrapper animation="slideUp" className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">See It In Action</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the fluid, intuitive interface that makes development collaboration seamless.
          </p>
        </AnimationWrapper>

        <AnimationWrapper animation="fadeIn" delay={0.2}>
          <div className="relative max-w-5xl mx-auto">
            {/* Main preview */}
            <div className="aspect-video relative overflow-hidden rounded-xl border border-gray-800 bg-[#0A0A0A] shadow-[0_0_25px_rgba(127,90,240,0.15)]">
              <div className="absolute inset-0">
                <Image
                  src={previewImages[activeIndex].src}
                  alt={previewImages[activeIndex].alt}
                  fill
                  className="object-cover transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent"></div>
              </div>
              
              {/* Video play button */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <button className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-[#7F5AF0]/80 text-white hover:bg-[#7F5AF0] transition-colors group">
                  <Play fill="white" size={24} className="ml-1 group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <p className="text-white text-sm md:text-base font-medium">{previewImages[activeIndex].caption}</p>
              </div>
            </div>

            {/* Navigation controls */}
            <div className="flex justify-center mt-6 gap-3">
              <Button
                onClick={prevSlide}
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <ArrowLeft size={16} />
              </Button>
              
              <div className="flex items-center gap-2">
                {previewImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      activeIndex === index 
                        ? "bg-[#7F5AF0] w-6" 
                        : "bg-gray-600 hover:bg-gray-500"
                    )}
                  />
                ))}
              </div>
              
              <Button
                onClick={nextSlide}
                variant="outline"
                size="icon"
                className="rounded-full"
              >
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
}