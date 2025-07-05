import type { Chat } from "~/types";
import { MOCK_CHAT } from "./mockData";

export function useChats() {
  const chats = useState<Chat[]>(() => [MOCK_CHAT]);

  function createChat(options: { projectId?: string } = {}) {
    const id = (chats.value.length + 1).toString();

    const chat: Chat = {
      id,
      title: `Chat ${id}`,
      messages: [],
      ...options,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    chats.value.push(chat);

    return chat;
  }

  function getChatsInProject(projectId: string) {
    return chats.value.filter((chat) => chat.projectId === projectId);
  }

  async function createChatAndNavigate(options: { projectId?: string } = {}) {
    const chat = createChat(options);

    if (chat.projectId) {
      await navigateTo(`/projects/${chat.projectId}/chats/${chat.id}`);
    } else {
      await navigateTo(`/chats/${chat.id}`);
    }
  }

  return {
    chats,
    createChat,
    getChatsInProject,
    createChatAndNavigate,
  };
}
