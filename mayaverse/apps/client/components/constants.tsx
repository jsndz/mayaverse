import { Page } from "@/lib/types";
import {
  IconHome,
  IconSettings,
  IconTerminal,
  IconUsers,
} from "@tabler/icons-react";

export const links = [
  {
    title: "Arena",
    icon: (
      <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: Page.arena,
  },
  {
    title: "Chat",
    icon: (
      <IconTerminal className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: Page.chat,
  },
  {
    title: "Members",
    icon: (
      <IconUsers className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: Page.members,
  },
  {
    title: "Settings",
    icon: (
      <IconSettings className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    href: Page.settings,
  },
];
