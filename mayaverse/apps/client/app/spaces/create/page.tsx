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
import { createSpace } from "@/endpoint/endpoint";

import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

const createSpaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dimension: z
    .string()
    .regex(/^[0-9]{1,4}x[0-9]{1,4}$/, "Dimension must be in WxH format"),
  mapId: z.string().optional(),
});

type CreateSpaceForm = z.infer<typeof createSpaceSchema>;

export default function CreateSpace() {
  const router = useRouter();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateSpaceForm>({
    resolver: zodResolver(createSpaceSchema),
  });

  const onSubmit = async (data: CreateSpaceForm) => {
    try {
      const token = localStorage.getItem("token");

      const id = await createSpace(token!, data.name, data.dimension);

      toast({
        title: "Success",
        description: "Space created successfully!",
      });

      router.push(`/spaces/${id}`);
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
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dimension">Dimension (Width x Height)</Label>
              <Input
                id="dimension"
                placeholder="e.g., 500x500"
                {...register("dimension")}
              />
              {errors.dimension && (
                <p className="text-sm text-destructive">
                  {errors.dimension.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mapId">Map ID (Optional)</Label>
              <Input
                id="mapId"
                placeholder="Enter map ID"
                {...register("mapId")}
              />
              {errors.mapId && (
                <p className="text-sm text-destructive">
                  {errors.mapId.message}
                </p>
              )}
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
