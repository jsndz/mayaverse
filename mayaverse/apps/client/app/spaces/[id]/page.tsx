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
import Chat from "@/components/Chat";

enum Page {
  "arena",
  "chat",
}

export default function Space() {
  const params = useParams<{ id: string }>();
  const [spaceDimension, setSpaceDimension] = useState<string>();
  const [page, setPage] = useState<Page>();
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
  if (!spaceDimension) return null;
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted relative">
      {page === Page.arena && (
        <Arena spaceDimension={spaceDimension} spaceId={params.id} />
      )}
      {page === Page.chat && (
        <Chat spaceDimension={spaceDimension} spaceId={params.id} />
      )}
    </div>
  );
}
