<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import type { Chat, Project } from "../types";

defineProps<{
  isOpen: boolean;
}>();

const route = useRoute();
const { projects, createProject } = useProjects();
const { chats, getChatsInProject, createChatAndNavigate } = useChats();

const chatsWithoutProject = computed(() => {
  return chats.value.filter((chat) => chat.projectId === undefined);
});

const todayChats = filterChats(0, 1);
const lastWeekChats = filterChats(7, 14);
const lastMonthChats = filterChats(30, 60);
const olderChats = filterChats(30);

const chatsInProject = computed(() => {
  return getChatsInProject(route.params.projectId as string);
});

const projectItems = computed<NavigationMenuItem[]>(() => {
  return projects.value?.map(formatProjectItem) || [];
});

async function handleCreateProject() {
  const project = await createProject();

  await createChatAndNavigate({
    projectId: project.id,
  });
}

function formatProjectChat(project: Project, chat: Chat): NavigationMenuItem {
  return {
    label: chat.title || "Untitled Chat",
    to: `/projects/${project.id}/chats/${chat.id}`,
    active: route.params.id === chat.id,
  };
}

function formatProjectItem(project: Project): NavigationMenuItem {
  const isCurrent = isCurrentProject(project.id);

  const baseItem = {
    label: project.name,
    to: `/projects/${project.id}`,
    active: isCurrent,
    defaultOpen: isCurrent,
  };

  if (isCurrent) {
    return {
      ...baseItem,
      children: chatsInProject.value.map((chat) =>
        formatProjectChat(project, chat)
      ),
    };
  }

  return baseItem;
}

function isCurrentProject(projectId: string): boolean {
  return route.params.projectId === projectId;
}

function filterChats(startDays: number, endDays?: number) {
  return computed(() => {
    return filterChatsByDateRange(
      chatsWithoutProject.value,
      startDays,
      endDays
    ).map(formatChatItem);
  });
}

function formatChatItem(chat: Chat): NavigationMenuItem {
  return {
    label: chat.title || "Untitled Chat",
    to: `/chats/${chat.id}`,
    active: route.params.id === chat.id,
  };
}

async function handleCreateChat() {
  await createChatAndNavigate();
}
</script>

<template>
  <aside
    class="fixed top-16 left-0 bottom-0 w-64 transition-transform duration-300 z-40 bg-(--ui-bg-muted) border-r-(--ui-border) border-r"
    :class="{ '-translate-x-full': !isOpen }"
  >
    <div
      v-if="projectItems.length > 0"
      class="mb-4 overflow-auto p-4 border-b border-(--ui-border)"
    >
      <div class="flex justify-between items-center mb-2">
        <h2 class="text-sm font-semibold text-(--ui-text-muted)">Projects</h2>
      </div>
      <UNavigationMenu
        orientation="vertical"
        default-open
        :items="projectItems"
      />

      <UButton
        size="sm"
        color="neutral"
        variant="soft"
        icon="i-heroicons-plus-small"
        class="mt-2 w-full"
        @click="handleCreateProject"
        >New Project</UButton
      >
    </div>

    <div v-if="chatsWithoutProject.length > 0" class="overflow-y-auto p-4">
      <div v-if="todayChats.length > 0" class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-sm font-semibold text-(--ui-text-muted)">Today</h2>
        </div>
        <UNavigationMenu
          orientation="vertical"
          default-open
          :items="todayChats"
        />
      </div>

      <div v-if="lastWeekChats.length > 0" class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-sm font-semibold text-(--ui-text-muted)">
            Last 7 days
          </h2>
        </div>
        <UNavigationMenu
          orientation="vertical"
          default-open
          :items="lastWeekChats"
        />
      </div>

      <div v-if="lastMonthChats.length > 0" class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-sm font-semibold text-(--ui-text-muted)">
            Last Month
          </h2>
        </div>
        <UNavigationMenu
          orientation="vertical"
          default-open
          :items="lastMonthChats"
        />
      </div>

      <div v-if="olderChats.length > 0" class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <h2 class="text-sm font-semibold text-(--ui-text-muted)">Older</h2>
        </div>
        <UNavigationMenu
          orientation="vertical"
          default-open
          :items="olderChats"
        />
      </div>
    </div>

    <div v-else class="overflow-y-auto p-4">
      <UAlert
        title="No Chats"
        description="Create a new chat to get started."
        color="neutral"
        variant="soft"
        class="mt-2"
      />
      <UButton
        size="sm"
        color="neutral"
        variant="soft"
        icon="i-heroicons-plus-small"
        class="mt-2 w-full"
        @click="handleCreateChat"
        >New Chat</UButton
      >
    </div>
  </aside>
</template>
