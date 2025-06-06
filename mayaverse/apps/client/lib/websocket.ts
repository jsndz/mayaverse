import { getUsersMeta } from "@/endpoint/endpoint";
import { Dispatch, SetStateAction } from "react";
import { Chats, User } from "./types";
import { useCallStore } from "@/store/useCallStore";
export async function getUserdata(users: string, token: string) {
  const userData = await getUsersMeta(token, users);
  return userData;
}
export function generateRandomId(length: number = 10): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
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
  setMessages: Dispatch<SetStateAction<Chats[]>>,
  currentUserId: string | undefined,
  peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>
) => {
  const { setIncomingCall, setAnswer } = useCallStore.getState();

  switch (message.type) {
    case "chat-message":
      let incomingMessageId = message.payload.messageId;

      setMessages((prev) => {
        const updated = [...prev];
        for (const chat of updated) {
          if (chat.messages?.some((msg) => msg.id === incomingMessageId)) {
            return prev;
          }
        }

        const index = updated.findIndex(
          (chat) => chat.mate === message.payload.sender
        );

        const newMessage = {
          id: incomingMessageId,
          text: message.payload.message,
          timestamp: new Date(),
          isMe: false,
        };
        if (index !== -1) {
          updated[index].messages!.push(newMessage);
        } else {
          updated.push({
            mate: message.payload.sender,
            messages: [newMessage],
          });
        }
        return updated;
      });
      break;

    case "video-request":
      setIncomingCall(message.senderId, message.payload.offer);
      break;

    case "answer-video-request":
      setAnswer(message.payload.answer);
      break;

    case "ice-candidate":
      if (peerConnectionRef.current) {
        peerConnectionRef.current.addIceCandidate(
          new RTCIceCandidate(message.payload.candidate)
        );
      }

      break;

    default:
      break;
  }
};
