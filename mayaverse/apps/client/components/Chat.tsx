import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconSend, IconPaperclip, IconMoodSmile, IconSearch, IconDotsVertical, IconPhone, IconVideo } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ChatProps {
  spaceDimension: string;
  spaceId: string;
}

interface Message {
  id: string;
  text: string;
  isMe: boolean;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
  online: boolean;
}

const Chat: React.FC<ChatProps> = ({ spaceDimension, spaceId }) => {
  const [selectedConversation, setSelectedConversation] = useState<string>("Henry Boyd");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hey How are you today?", isMe: false, timestamp: new Date(), status: 'read' },
    { id: "2", text: "I'm doing great, thanks for asking!", isMe: true, timestamp: new Date(), status: 'read' },
    { id: "3", text: "How's the project going?", isMe: false, timestamp: new Date(), status: 'read' },
    { id: "4", text: "It's going well, we're making good progress", isMe: true, timestamp: new Date(), status: 'delivered' },
  ]);

  const conversations: Conversation[] = [
    { id: "1", name: "Henry Boyd", avatar: "H", lastMessage: "Hey How are you today?", timestamp: new Date(), unread: 0, online: true },
    { id: "2", name: "Marta Curtis", avatar: "M", lastMessage: "Can you review the latest changes?", timestamp: new Date(), unread: 2, online: false },
    { id: "3", name: "Philip Tucker", avatar: "P", lastMessage: "Great work on the new feature!", timestamp: new Date(), unread: 0, online: true },
    { id: "4", name: "Christine Reid", avatar: "C", lastMessage: "Let's schedule a meeting", timestamp: new Date(), unread: 1, online: false },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
            />
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="https://avatars3.githubusercontent.com/u/2763884?s=128" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">jsndz</h2>
                <p className="text-sm text-muted-foreground">Lead UI/UX Designer</p>
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

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Conversations</h3>
              <Badge variant="secondary" className="ml-auto">4</Badge>
            </div>
            <div className="space-y-1">
              {conversations.map((conv) => (
                <Button
                  key={conv.id}
                  variant={selectedConversation === conv.name ? "secondary" : "ghost"}
                  className="w-full justify-start space-x-3 relative"
                  onClick={() => setSelectedConversation(conv.name)}
                >
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{conv.avatar}</AvatarFallback>
                    </Avatar>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{conv.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {conv.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground truncate max-w-[150px]">{conv.lastMessage}</span>
                      {conv.unread > 0 && (
                        <Badge variant="default" className="ml-2">{conv.unread}</Badge>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
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
                <AvatarFallback>H</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">Henry Boyd</h2>
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
                    <Button variant="ghost" size="icon">
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
            {messages.map((message) => (
              <div
                key={message.id}
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
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {message.isMe && (
                        <span className="text-xs">
                          {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* Typing Indicator */}
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
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
                    <IconSend className="h-5 w-5" />
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
