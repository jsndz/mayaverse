import { getUsersMeta } from "@/endpoint/endpoint";
import { Dispatch, SetStateAction } from "react";
import { Chats, User } from "./types";

export async function getUserdata(users: string, token: string) {
  const userData = await getUsersMeta(token, users);
  return userData;
}

export const handleWSEvent = (
  message: any,
  token: string,
  setCurrentUser: Dispatch<SetStateAction<User | null>>,

  setUsers: Dispatch<SetStateAction<Map<string, User>>>
) => {
  switch (message.type) {
    case "space-joined": {
      const fetchCurrentUser = async () => {
        const userData = await getUserdata(message.payload.id, token);

        setCurrentUser({
          avatar: userData.avatar,
          name: userData.name,
          id: message.payload.id,
          position: {
            x: message.payload.spawn.x,
            y: message.payload.spawn.y,
          },
        });

        const newUsers = new Map<string, User>(
          message.payload.users.map((user: User) => [
            user.id,
            {
              ...user,
              position: user.position || { x: 0, y: 0 },
            },
          ])
        );
        setUsers(newUsers);
      };
      fetchCurrentUser();
      break;
    }

    case "user-joined": {
      const fetchUserData = async () => {
        try {
          const userData = await getUserdata(message.payload.userId, token);

          setUsers((prevUsers) => {
            const newUsers = new Map(prevUsers);
            newUsers.set(message.payload.userId, {
              id: message.payload.userId,
              avatar: userData.avatar,
              name: userData.name,
              position: {
                x: message.payload.x,
                y: message.payload.y,
              },
            });
            return newUsers;
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
      break;
    }

    case "movement": {
      setUsers((prevUsers) => {
        const newUsers = new Map(prevUsers);
        const user = newUsers.get(message.payload.userId);

        if (user) {
          newUsers.set(message.payload.userId, {
            ...user,
            position: {
              x: message.payload.x,
              y: message.payload.y,
            },
          });
        }

        return newUsers;
      });
      break;
    }

    case "movement-rejected": {
      setCurrentUser((prev) =>
        prev
          ? {
              ...prev,
              position: {
                x: message.event.x,
                y: message.event.y,
              },
            }
          : prev
      );
      break;
    }

    case "user-left": {
      setUsers((prevUsers) => {
        const newUsers = new Map(prevUsers);
        newUsers.delete(message.payload.userId);
        return newUsers;
      });
      break;
    }

    default:
      break;
  }
};

export const handleChatEvents = (
  message: any,
  token: string,
  setMessages: Dispatch<SetStateAction<Chats[]>>
) => {
  switch (message.type) {
    case "chat-message":
      setMessages((prev) => {
        const messages: Chats[] = prev;
        messages
          .find((user) => user.mate === message.payload.sender)
          ?.messages?.push({
            id: message.payload.sender,
            text: message.payload.text,
            isMe: false,
            timestamp: new Date(Date.now()),
          });
        return messages;
      });
  }
};
