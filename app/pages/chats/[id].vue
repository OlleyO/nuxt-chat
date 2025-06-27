<script lang="ts" setup>
const route = useRoute();
const appConfig = useAppConfig();
const {
  chat: chatData,
  messages,
  sendMessage,
} = useChat(route.params.id as string);

const isTyping = ref(false);

if (!chatData.value) {
  await navigateTo("/", { replace: true });
}

const chat = computed(() => chatData.value);

const title = computed(() =>
  chat.value?.title
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
    v-if="chat"
    :messages="messages"
    :chat="chat"
    :typing="isTyping"
    @send-message="handleSendMessage"
  />
</template>
