import type { Chat, ChatMessage, MessageRole } from "~/types";
import { MOCK_CHAT } from "#imports";

export default function useChat() {
  const chat = ref<Chat>(MOCK_CHAT);
  const messages = computed<ChatMessage[]>(() => chat.value.messages);

  function createMessage(message: string, role: MessageRole) {
    const id = messages.value.length.toString();

    return {
      id,
      role,
      content: message,
    };
  }

  async function sendMessage(message: string) {
    chat.value.messages.push(createMessage(message, "user"));

    const data = await $fetch<ChatMessage>("/api/ai", {
      method: "POST",
      body: {
        messages: messages.value,
      },
    });

    chat.value.messages.push(data);
  }

  return {
    chat,
    messages,
    sendMessage,
  };
}
