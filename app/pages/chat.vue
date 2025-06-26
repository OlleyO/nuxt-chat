<script lang="ts" setup>
const { chat, messages, sendMessage } = useChat();
const appConfig = useAppConfig();

const isTyping = ref(false);

const title = computed(() =>
  chat.value.title
    ? `${chat.value.title} - ${appConfig.title}`
    : appConfig.title
);

useHead({
  title,
});

async function handleSendMessage(message: string) {
  isTyping.value = true;
  await sendMessage(message);
  isTyping.value = false;
}
</script>

<template>
  <ChatWindow
    :messages="messages"
    :chat="chat"
    :typing="isTyping"
    @send-message="handleSendMessage"
  />
</template>
