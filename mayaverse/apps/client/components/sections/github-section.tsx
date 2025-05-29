"use client";

import { Button } from "@/components/ui/button";
import AnimationWrapper from "@/components/animation-wrapper";
import { Github, Star, GitFork } from "lucide-react";

export function GithubSection() {
  return (
    <section id="github" className="py-16 relative">
      <div className="container mx-auto px-4">
        <AnimationWrapper animation="fadeIn" className="max-w-4xl mx-auto">
          <div className="rounded-xl overflow-hidden border border-gray-800 bg-[#121212]/80 backdrop-blur-sm p-8 md:p-10 relative">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-1/2 bg-[#7F5AF0]/5 rounded-full filter blur-[60px]" />

            <div className="text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">
                Dive Into the Code
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                Mayaverse is open source and welcomes contributions. Explore the
                codebase, suggest improvements, or fork the project to build
                your own version.
              </p>

              {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 py-2 px-4 bg-[#161616] rounded-lg">
                  <Star className="text-yellow-400" size={18} />
                  <span className="font-medium">1.2k stars</span>
                </div>
                
                <div className="flex items-center gap-2 py-2 px-4 bg-[#161616] rounded-lg">
                  <GitFork className="text-[#00C2FF]" size={18} />
                  <span className="font-medium">342 forks</span>
                </div>
                
                <div className="flex items-center gap-2 py-2 px-4 bg-[#161616] rounded-lg">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold">JD</div>
                    <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-bold">KL</div>
                    <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-[10px] font-bold">MR</div>
                    <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] font-bold">+18</div>
                  </div>
                  <span className="font-medium">Contributors</span>
                </div>
              </div> */}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="glow"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Github size={18} />
                  <span>View Repository</span>
                </Button>

                <Button variant="outline_glow" size="lg">
                  Documentation
                </Button>
              </div>
            </div>
          </div>
        </AnimationWrapper>
      </div>
    </section>
  );
}
