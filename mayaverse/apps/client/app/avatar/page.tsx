"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const DEFAULT_AVATARS = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    name: "Avatar 1"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    name: "Avatar 2"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop",
    name: "Avatar 3"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&h=150&fit=crop",
    name: "Avatar 4"
  }
];

export default function AvatarSelection() {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const { toast } = useToast();

  const handleAvatarSelect = (id: number) => {
    setSelectedAvatar(id);
  };

  const handleSubmit = async () => {
    if (!selectedAvatar) {
      toast({
        title: "Error",
        description: "Please select an avatar",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement avatar selection API call
    toast({
      title: "Avatar selected",
      description: "Your avatar has been updated successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Choose Your Avatar</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {DEFAULT_AVATARS.map((avatar) => (
            <Card
              key={avatar.id}
              className={`cursor-pointer transition-all ${
                selectedAvatar === avatar.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleAvatarSelect(avatar.id)}
            >
              <CardContent className="p-4">
                <div className="aspect-square relative rounded-full overflow-hidden mb-2">
                  <Image
                    src={avatar.url}
                    alt={avatar.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-center text-sm">{avatar.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!selectedAvatar}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}