import type { Chat, ChatMessage } from "~/layers/chat/app/types";

export default function useChat(chatId: string) {
  const { chats } = useChats();

  const chat = computed(() => chats.value.find((chat) => chat.id === chatId));

  const messages = computed<ChatMessage[]>(() => chat.value?.messages || []);

  function updateChat(chat: Partial<Chat>) {
    if (!chat.id) return;

    const index = chats.value.findIndex((c) => c.id === chat.id);

    if (index !== -1) {
      chats.value[index] = {
        ...chats.value[index],
        ...chat,
        id: chatId,
      } as Chat;
    }
  }

  function createMessage(message: string, role: ChatMessage["role"]) {
    const id = messages.value.length.toString();

    return {
      id,
      role,
      content: message,
    };
  }

  async function sendMessage(message: string) {
    updateChat({
      id: chatId,
      messages: [...messages.value, createMessage(message, "user")],
    });

    const data = await $fetch<ChatMessage>("/api/ai", {
      method: "POST",
      body: {
        messages: messages.value,
      },
    });

    updateChat({
      id: chatId,
      messages: [...messages.value, data],
      updatedAt: new Date(),
    });
  }

  return {
    chat,
    messages,
    sendMessage,
  };
}
