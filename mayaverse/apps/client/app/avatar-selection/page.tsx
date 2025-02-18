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

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getAvatars, updateUserMetadata } from "@/endpoint/endpoint";

interface Avatar {
  id: string;
  imageUrl: string;
  name: string;
}

export default function AvatarSelection() {
  const router = useRouter();
  const { toast } = useToast();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

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

  const handleAvatarSelect = async () => {
    if (!selectedAvatar) {
      toast({
        title: "Error",
        description: "Please select an avatar",
        variant: "destructive",
      });
      return;
    }
    const token = localStorage.getItem("token");
    console.log(token);

    try {
      const res = await updateUserMetadata(token!, selectedAvatar);
      toast({
        title: "Success",
        description: "Avatar selected successfully!",
      });
      router.push("/spaces");
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
                  src={avatar.imageUrl}
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
