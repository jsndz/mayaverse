"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Users } from "lucide-react";
import Link from "next/link";

const spaces = [
  {
    id: 1,
    name: "Design Team",
    description: "Collaborative space for our design team",
    members: 8,
  },
  {
    id: 2,
    name: "Development Hub",
    description: "Frontend and backend collaboration",
    members: 12,
  },
  {
    id: 3,
    name: "Marketing Space",
    description: "Campaign planning and coordination",
    members: 6,
  },
];

export default function Spaces() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Collaboration Spaces</h1>
          <Link href="/spaces/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Space
            </Button>
          </Link>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <Link key={space.id} href={`/spaces/${space.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{space.name}</CardTitle>
                  <CardDescription>{space.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{space.members} members</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}