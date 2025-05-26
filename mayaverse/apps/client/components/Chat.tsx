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
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {showModal && (
        <CallingModal peerId={selectedConversation?.id} setPage={setPage} />
      )}
      {/* Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
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
              <Badge variant="secondary" className="ml-auto">
                {users.size}
              </Badge>
            </div>
            <div className="space-y-1">
              <div className="space-y-1">
                {users &&
                  Array.from(users.values()).map((user) => {
                    return (
                      <Button
                        key={user.id}
                        variant={
                          selectedConversation?.name === user.name
                            ? "secondary"
                            : "ghost"
                        }
                        className="w-full justify-start space-x-3 relative"
                        onClick={() => setSelectedConversation(user)}
                      >
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground"></span>
                          </div>
                          <div className="flex items-center justify-between"></div>
                        </div>
                      </Button>
                    );
                  })}
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={selectedConversation?.avatar}></AvatarImage>
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
                      onClick={() => {
                        setShowModal(true);
                        // setPage(Page.members);
                      }}
                    >
                      <IconVideo className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Video Call</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {
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
              ></ChatMessages>
            }
          </div>
        </ScrollArea>

        {/* Message Input */}
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
              onChange={(e) => {
                setText(e.target.value);
              }}
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
                        if (selectedConversation) {
                          handleMessage(text);
                        }
                      }}
                      className="h-5 w-5"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send message</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

const ChatMessages: React.FC<Chats> = ({ mate, messages }) => {
  return (
    <div>
      {messages &&
        messages.map((message, index) => {
          return (
            <div
              key={index}
              className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
            >
              <div className="flex flex-col max-w-[70%]">
                <div
                  className={`rounded-lg p-3 ${
                    message.isMe
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};
