"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const createSpaceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.string(),
  maxMembers: z.string().transform(Number),
});

type CreateSpaceForm = z.infer<typeof createSpaceSchema>;

export default function CreateSpace() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateSpaceForm>({
    resolver: zodResolver(createSpaceSchema),
    defaultValues: {
      type: "open",
      maxMembers: "10",
    },
  });

  const onSubmit = async (data: CreateSpaceForm) => {
    try {
      // TODO: Implement space creation logic
      console.log("Space creation data:", data);
      toast({
        title: "Success",
        description: "Space created successfully!",
      });
      router.push("/spaces");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create space. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create New Space</CardTitle>
          <CardDescription>
            Set up a new collaboration space for your team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Space Name</Label>
              <Input
                id="name"
                placeholder="Enter space name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the purpose of this space"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Space Type</Label>
                <Select defaultValue="open">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open Space</SelectItem>
                    <SelectItem value="private">Private Space</SelectItem>
                    <SelectItem value="invite">Invite Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxMembers">Maximum Members</Label>
                <Input
                  id="maxMembers"
                  type="number"
                  min="2"
                  max="50"
                  {...register("maxMembers")}
                />
                {errors.maxMembers && (
                  <p className="text-sm text-destructive">
                    {errors.maxMembers.message}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating Space..." : "Create Space"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}