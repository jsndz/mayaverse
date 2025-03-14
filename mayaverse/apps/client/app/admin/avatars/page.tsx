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
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios, { getAdapter } from "axios";
import { createAvatar, deleteAvatar, getAvatars } from "@/endpoint/endpoint";

interface Avatar {
  id: string;
  imageUrl: string;
  name: string;
}

export default function AdminAvatars() {
  const { toast } = useToast();
  const token = localStorage.getItem("token");

  const [avatars, setAvatars] = useState<Avatar[]>([]);

  const handleAddAvatar = async (imageUrl: string, name: string) => {
    try {
      const response = await createAvatar(token!, name, imageUrl);
      const newAvatar = response.data;
      setAvatars([...avatars, newAvatar]);
      toast({ title: "Success", description: "Avatar added successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add avatar." });
    }
  };

  const handleDeleteAvatar = async (id: string) => {
    await deleteAvatar(token!, id);
    setAvatars(avatars.filter((avatar) => avatar.id !== id));
    toast({ title: "Success", description: "Avatar deleted successfully!" });
  };
  useEffect(() => {
    async function fetchAvatars() {
      try {
        const res = await getAvatars();

        if (res && Array.isArray(res.avatars)) {
          setAvatars(res.avatars);
        }
      } catch (error) {
        console.error("Error fetching avatars:", error);
      }
    }
    fetchAvatars();
  }, []);
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
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const imageUrl = (
                    form.elements.namedItem("imageUrl") as HTMLInputElement
                  ).value;
                  const name = (
                    form.elements.namedItem("name") as HTMLInputElement
                  ).value;
                  await handleAddAvatar(imageUrl, name);
                  form.reset();
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Avatar URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
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
                    src={avatar.imageUrl}
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
