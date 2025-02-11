import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Map, Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Real-time Collaboration Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect, collaborate, and create together in real-time. Join spaces, interact with others, and bring your ideas to life.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link href="/auth/signup">
              <Button size="lg">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Users className="h-10 w-10" />}
            title="Real-time Collaboration"
            description="Work together with your team in real-time, seeing changes as they happen."
          />
          <FeatureCard
            icon={<Map className="h-10 w-10" />}
            title="Interactive Spaces"
            description="Create and customize spaces for your team to collaborate in."
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10" />}
            title="Secure Access"
            description="Role-based access control and secure authentication."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10" />}
            title="Real-time Updates"
            description="See changes instantly with WebSocket integration."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg bg-card border">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}