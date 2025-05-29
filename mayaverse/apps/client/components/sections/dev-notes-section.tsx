"use client";

import AnimationWrapper from "@/components/animation-wrapper";
import { Button } from "@/components/ui/button";
import { GitBranch, Github } from "lucide-react";

export function DevNotesSection() {
  return (
    <section id="notes" className="py-24 bg-[#0A0A0A] relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-[#7F5AF0]/10 rounded-full filter blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-[#00C2FF]/5 rounded-full filter blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Built by developers section */}
          <AnimationWrapper animation="slideUp">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-space-grotesk">
                Built by a Developer,
                <br />
                for Developers
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-400 mb-4">
                  Mayaverse started as a personal project to solve real
                  communication challenges in remote development teams. As
                  developers, we understand the need for distraction-free,
                  purpose-built spaces that enhance collaboration without
                  sacrificing productivity.
                </p>
                <p className="text-gray-400 mb-4">
                  The core philosophy is "developer-first" — every feature,
                  interaction, and design decision is made with the developer
                  workflow in mind. We've optimized for seamless integration
                  with your existing tools and thoughtful defaults that make
                  sense for coding-focused communication.
                </p>
                <p className="text-gray-300 font-medium">
                  This is the tool we wished existed, so we built it.
                </p>
              </div>
            </div>
          </AnimationWrapper>

          {/* What I Learned section */}
          <AnimationWrapper animation="slideLeft" delay={0.2}>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-space-grotesk">
                What I Learned
              </h2>

              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-[#7F5AF0]/20 p-2 rounded-lg mr-3 mt-1">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#7F5AF0] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1 font-space-grotesk">
                      Handling avatar location sync
                    </h3>
                    <p className="text-gray-400 text-sm">
                      The challenge of maintaining real-time position data
                      across multiple clients led to implementing a hybrid
                      solution with optimistic updates.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="bg-[#7F5AF0]/20 p-2 rounded-lg mr-3 mt-1">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#7F5AF0] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1 font-space-grotesk">
                      Designing real-time architecture
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Building a scalable system that maintains connection
                      stability while handling concurrent events from multiple
                      users required careful architecture planning.
                    </p>
                  </div>
                </li>

                <li className="flex items-start">
                  <div className="bg-[#7F5AF0]/20 p-2 rounded-lg mr-3 mt-1">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-2 h-2 bg-[#7F5AF0] rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1 font-space-grotesk">
                      Building a 1v1 Video Call
                    </h3>
                    <p className="text-gray-400 text-sm">
                      It was a great learning experience to implement WebRTC for
                      real-time video communication, and handling bugs was a
                      challenge that taught me a lot about media streams.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </AnimationWrapper>
        </div>
      </div>
    </section>
  );
}
