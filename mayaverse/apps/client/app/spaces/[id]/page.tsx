"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "next/navigation";
import Arena from "@/components/Arena";
import { getSpaceData } from "@/endpoint/endpoint";
import { Page, SpaceData } from "@/lib/types";
import Chat from "@/components/Chat";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconHome, IconSettings, IconTerminal, IconUsers } from "@tabler/icons-react";
import { toast } from "sonner";
import { Spaceheader } from "@/components/FloatingDock";
import { Loader } from "lucide-react";

export default function Space() {
  const params = useParams<{ id: string }>();
  const [spaceDimension, setSpaceDimension] = useState<string>();
  const [page, setPage] = useState<Page>(Page.arena);
  const ws_url =
    process.env.NEXT_PUBLIC_STATE === "development"
      ? process.env.NEXT_PUBLIC_DEV_WS
      : process.env.NEXT_PUBLIC_PROD_WS;
      const [isLoading, setIsLoading] = useState(true);
      const { toast } = useToast();
      // Enhanced navigation links
      const links = [
        {
          title: "Arena",
          icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
          href: Page.arena,
        },
        {
          title: "Chat",
          icon: <IconTerminal className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
          href: Page.chat,
        },
        {
          title: "Members",
          icon: <IconUsers className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
          href: Page.members,
        },
        {
          title: "Settings",
          icon: <IconSettings className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
          href: Page.settings,
        },
      ];
    
      useEffect(() => {
        async function getSpace() {
          try {
            const token = localStorage.getItem("token");
            const space: SpaceData = await getSpaceData(token!, params.id);
            setSpaceDimension(space.dimension);
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to load space data",
              variant: "destructive",
            });
          } finally {
            setIsLoading(false);
          }
        }
    
        getSpace();
      }, []);
    
      if (isLoading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <Loader size="lg" />
          </div>
        );
      }
    
      if (!spaceDimension) {
        return (
          <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h2 className="text-xl font-semibold">Space Not Found</h2>
            <p className="text-muted-foreground">The requested space could not be found.</p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        );
      }
    
      return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted">
          
          <main className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center w-full">
              <FloatingDock
                setPage={setPage}
                mobileClassName="translate-y-20"
                items={links}
              />
            </div>
    
            <div className="mt-8">
              {page === Page.arena && (
                <Arena spaceDimension={spaceDimension} spaceId={params.id} />
              )}
              {page === Page.chat && (
                <Chat spaceDimension={spaceDimension} spaceId={params.id} />
              )}
              {/* {page === Page.members && <SpaceM spaceId={params.id} />}
              {page === Page.settings && <SpaceSettings spaceId={params.id} />} */}
            </div>
          </main>
        </div>
      );
    }