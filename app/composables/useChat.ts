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

  function sendMessage(message: string) {
    chat.value.messages.push(createMessage(message, "user"));

    setTimeout(() => {
      chat.value.messages.push(
        createMessage(`You said: ${message}`, "assistant")
      );
    }, 200);
  }

  return {
    chat,
    messages,
    sendMessage,
  };
}
