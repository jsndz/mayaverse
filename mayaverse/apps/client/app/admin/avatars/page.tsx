"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";
import Image from "next/image";

interface Avatar {
  id: number;
  url: string;
  name: string;
}

export default function AdminAvatars() {
  const [avatars, setAvatars] = useState<Avatar[]>([
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
      name: "Avatar 1"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      name: "Avatar 2"
    }
  ]);
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [newAvatarName, setNewAvatarName] = useState("");
  const { toast } = useToast();

  const handleAddAvatar = () => {
    if (!newAvatarUrl || !newAvatarName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement API call
    const newAvatar = {
      id: avatars.length + 1,
      url: newAvatarUrl,
      name: newAvatarName,
    };

    setAvatars([...avatars, newAvatar]);
    setNewAvatarUrl("");
    setNewAvatarName("");
    
    toast({
      title: "Avatar added",
      description: "New avatar has been added successfully",
    });
  };

  const handleDeleteAvatar = (id: number) => {
    // TODO: Implement API call
    setAvatars(avatars.filter(avatar => avatar.id !== id));
    
    toast({
      title: "Avatar deleted",
      description: "Avatar has been deleted successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Manage Avatars</h1>
        
        {/* Add New Avatar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Avatar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  value={newAvatarUrl}
                  onChange={(e) => setNewAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatarName">Avatar Name</Label>
                <Input
                  id="avatarName"
                  value={newAvatarName}
                  onChange={(e) => setNewAvatarName(e.target.value)}
                  placeholder="Cool Avatar"
                />
              </div>
            </div>
            <Button
              className="mt-4"
              onClick={handleAddAvatar}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Avatar
            </Button>
          </CardContent>
        </Card>

        {/* Avatar List */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {avatars.map((avatar) => (
            <Card key={avatar.id}>
              <CardContent className="p-4">
                <div className="aspect-square relative rounded-full overflow-hidden mb-2">
                  <Image
                    src={avatar.url}
                    alt={avatar.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-center font-medium mb-2">{avatar.name}</p>
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      // TODO: Implement edit functionality
                      toast({
                        title: "Edit avatar",
                        description: "Edit functionality coming soon",
                      });
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteAvatar(avatar.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}