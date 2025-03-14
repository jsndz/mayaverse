"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import Arena from "@/components/Arena";
import { getSpaceData } from "@/endpoint/endpoint";
import { SpaceData } from "@/lib/types";

export default function Space() {
  const params = useParams<{ id: string }>();
  const [spaceDimension, setSpaceDimension] = useState<string>();
  const ws_url =
    process.env.NEXT_PUBLIC_STATE === "development"
      ? process.env.NEXT_PUBLIC_DEV_WS
      : process.env.NEXT_PUBLIC_PROD_WS;

  useEffect(() => {
    async function getSpace() {
      const token = localStorage.getItem("token");
      const space: SpaceData = await getSpaceData(token!, params.id);
      setSpaceDimension(space.dimension);
    }

    getSpace();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted relative">
      {spaceDimension ? (
        <Arena spaceDimension={spaceDimension} spaceId={params.id}></Arena>
      ) : null}
    </div>
  );
}
