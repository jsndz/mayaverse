"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllSpaces } from "@/endpoint/endpoint";
import { Plus, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Space {
  id: string;
  name: string;
  dimension: string;
  thumbnail: string;
}

export default function Spaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  useEffect(() => {
    async function fetchSpaces() {
      try {
        const token = localStorage.getItem("token");

        const res = await getAllSpaces(token!);

        if (res && Array.isArray(res)) {
          setSpaces(res);
        }
      } catch (error) {
        console.error("Error fetching avatars:", error);
      }
    }
    fetchSpaces();
  }, []);
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
                <div className="relative w-full h-40">
                  <img
                    src={space.thumbnail}
                    alt={`${space.name} thumbnail`}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{space.name}</CardTitle>
                  <CardDescription>{space.dimension}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
