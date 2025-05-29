"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Github, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#121212]/90 backdrop-blur-md py-3 shadow-md"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link
          href="/"
          className="text-white font-bold text-2xl flex items-center gap-2"
        >
          <span className="text-[#7F5AF0]">
            <Code size={28} />
          </span>
          <span className="font-space-grotesk">Mayaverse</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#preview">Preview</NavLink>
          <NavLink href="#tech">Tech Stack</NavLink>
          <NavLink href="#notes">Dev Notes</NavLink>

          <div className="flex gap-3 ml-4">
            <Button
              variant="outline_glow"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => {
                router.push("https:/github.com/jsndz/mayaverse");
              }}
            >
              <Github size={16} />
              <span>GitHub</span>
            </Button>
            <Button
              variant="glow"
              size="sm"
              onClick={() => {
                router.push("/auth/signin");
              }}
            >
              Sign In
            </Button>
          </div>
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#121212]/95 backdrop-blur-md overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <MobileNavLink
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </MobileNavLink>
              <MobileNavLink
                href="#preview"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preview
              </MobileNavLink>
              <MobileNavLink
                href="#tech"
                onClick={() => setMobileMenuOpen(false)}
              >
                Tech Stack
              </MobileNavLink>
              <MobileNavLink
                href="#notes"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dev Notes
              </MobileNavLink>

              <div className="flex gap-3 ml-4">
                <Button
                  variant="outline_glow"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => {
                    router.push("https:/github.com/jsndz/mayaverse");
                  }}
                >
                  <Github size={16} />
                  <span>GitHub</span>
                </Button>
                <Button
                  variant="glow"
                  size="sm"
                  onClick={() => {
                    router.push("/auth/signin");
                  }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-gray-300 hover:text-white transition-colors text-lg font-medium py-2 border-b border-gray-800"
    >
      {children}
    </Link>
  );
}
