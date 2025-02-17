"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface Avatar {
  id: number;
  url: string;
  name: string;
}

export default function AdminAvatars() {
  const { toast } = useToast();
  const [avatars, setAvatars] = useState<Avatar[]>([
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      name: "Default 1",
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      name: "Default 2",
    },
  ]);

  const handleAddAvatar = (url: string, name: string) => {
    const newAvatar = {
      id: Date.now(),
      url,
      name,
    };
    setAvatars([...avatars, newAvatar]);
    toast({
      title: "Success",
      description: "Avatar added successfully!",
    });
  };

  const handleDeleteAvatar = (id: number) => {
    setAvatars(avatars.filter((avatar) => avatar.id !== id));
    toast({
      title: "Success",
      description: "Avatar deleted successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="border-b">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Avatars</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Avatar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Avatar</DialogTitle>
                <DialogDescription>
                  Add a new avatar to the platform.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const url = (form.elements.namedItem("url") as HTMLInputElement)
                    .value;
                  const name = (
                    form.elements.namedItem("name") as HTMLInputElement
                  ).value;
                  handleAddAvatar(url, name);
                  form.reset();
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="url">Avatar URL</Label>
                  <Input
                    id="url"
                    name="url"
                    placeholder="https://example.com/avatar.jpg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Avatar Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Avatar name"
                    required
                  />
                </div>
                <Button type="submit">Add Avatar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {avatars.map((avatar) => (
            <Card key={avatar.id}>
              <CardHeader>
                <CardTitle>{avatar.name}</CardTitle>
                <CardDescription>ID: {avatar.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-square rounded-lg overflow-hidden mb-4">
                  <Image
                    src={avatar.url}
                    alt={avatar.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => handleDeleteAvatar(avatar.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Avatar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}