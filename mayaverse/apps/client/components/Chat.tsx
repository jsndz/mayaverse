// Updated Chat component with WhatsApp-like responsive layout

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IconSend,
  IconPaperclip,
  IconMoodSmile,
  IconSearch,
  IconDotsVertical,
  IconPhone,
  IconVideo,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChatProps, Chats, Page } from "@/lib/types";
import CallingModal from "./CallingModal";

const Chat: React.FC<ChatProps> = ({
  users,
  currentUser,
  selectedConversation,
  messages,
  setSelectedConversation,
  handleMessage,
  setPage,
}) => {
  const [text, setText] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const [isMobileView, setIsMobileView] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showSidebar = !isMobileView || !selectedConversation;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {showModal && (
        <CallingModal peerId={selectedConversation?.id} setPage={setPage} />
      )}

      {/* Sidebar */}
      {showSidebar && (
        <div className="w-full md:w-80 border-r border-border flex flex-col">
          {/* Search Bar */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search members..." className="pl-9" />
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{currentUser.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.position.x}-{currentUser.position.y}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <IconDotsVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile Settings</DropdownMenuItem>
                  <DropdownMenuItem>Notifications</DropdownMenuItem>
                  <DropdownMenuItem>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Members List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Members
                </h3>
                <Badge variant="secondary">{users.size}</Badge>
              </div>
              <div className="space-y-1">
                {Array.from(users.values()).map((user) => (
                  <Button
                    key={user.id}
                    variant={
                      selectedConversation?.name === user.name
                        ? "secondary"
                        : "ghost"
                    }
                    className="w-full justify-start space-x-3"
                    onClick={() => setSelectedConversation(user)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Chat Window */}
      {selectedConversation && (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="border-b border-border p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isMobileView && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedConversation(undefined)}
                >
                  ←
                </Button>
              )}
              <Avatar>
                <AvatarImage src={selectedConversation?.avatar} />
                <AvatarFallback>H</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{selectedConversation?.name}</h2>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <IconPhone className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Call</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowModal(true)}
                    >
                      <IconVideo className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Video Call</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              <ChatMessages
                mate={
                  messages.find(
                    (user) => user.mate === selectedConversation?.id
                  )?.mate
                }
                messages={
                  messages.find(
                    (user) => user.mate === selectedConversation?.id
                  )?.messages
                }
              />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <IconPaperclip className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Attach file</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <IconMoodSmile className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add emoji</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon">
                      <IconSend
                        onClick={() => {
                          if (selectedConversation && text.trim()) {
                            handleMessage(text);
                            setText("");
                          }
                        }}
                        className="h-5 w-5"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;

const ChatMessages: React.FC<Chats> = ({ mate, messages }) => {
  return (
    <div>
      {messages?.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
        >
          <div className="flex flex-col max-w-[70%]">
            <div
              className={`rounded-lg p-3 text-sm whitespace-pre-wrap break-words ${
                message.isMe ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              <p>{message.text}</p>
              <div className="text-xs opacity-70 mt-1 text-right">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
