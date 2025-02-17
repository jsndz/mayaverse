import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Users, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6" />
            <span className="text-xl font-bold">Collab Space</span>
          </div>
          <div className="space-x-4">
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">
            Collaborate in Real-Time,{" "}
            <span className="text-primary">Anywhere</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join a new generation of collaboration. Create virtual spaces, move
            freely, and work together in real-time with team members around the
            globe.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="mr-4">
              Start Collaborating
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </Link>
        </section>

        <section id="features" className="grid md:grid-cols-3 gap-8 py-16">
          <Card className="p-6">
            <Users className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-Time Interaction</h3>
            <p className="text-muted-foreground">
              Collaborate with team members in real-time with instant updates and
              smooth interactions.
            </p>
          </Card>
          <Card className="p-6">
            <Globe className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Custom Spaces</h3>
            <p className="text-muted-foreground">
              Create and customize your collaboration spaces with interactive maps
              and tools.
            </p>
          </Card>
          <Card className="p-6">
            <Zap className="h-12 w-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Instant Updates</h3>
            <p className="text-muted-foreground">
              See changes and movements instantly with our powerful WebSocket
              integration.
            </p>
          </Card>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Collab Space. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}