"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const avatars = [
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
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
    name: "Default 3",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    name: "Default 4",
  },
];

export default function AvatarSelection() {
  const router = useRouter();
  const { toast } = useToast();
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const handleAvatarSelect = async () => {
    if (!selectedAvatar) {
      toast({
        title: "Error",
        description: "Please select an avatar",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Success",
        description: "Avatar selected successfully!",
      });
      router.push("/auth/signin");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to select avatar. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Choose Your Avatar</CardTitle>
          <CardDescription>
            Select an avatar to represent you in collaboration spaces.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {avatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                  selectedAvatar === avatar.id
                    ? "ring-4 ring-primary"
                    : "hover:ring-2 hover:ring-primary/50"
                }`}
                onClick={() => setSelectedAvatar(avatar.id)}
              >
                <Image
                  src={avatar.url}
                  alt={avatar.name}
                  width={150}
                  height={150}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
          <Button
            onClick={handleAvatarSelect}
            className="w-full"
            disabled={!selectedAvatar}
          >
            Continue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
