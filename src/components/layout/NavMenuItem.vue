<template>
  <template v-if="item.type === 'title'">
    <p
      v-if="sidebarOpen"
      class="px-3 pt-4 pb-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50 first:pt-2"
    >
      {{ item.label }}
    </p>
  </template>

  <RouterLink
    v-else-if="item.type === 'link' && depth === 0"
    :to="item.to"
    class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-white"
    :class="{ 'bg-sidebar-accent text-white': isPathActive(currentPath, item.to) }"
    :title="!sidebarOpen ? item.label : undefined"
  >
    <component :is="item.icon" class="w-5 h-5 shrink-0" />
    <span v-if="sidebarOpen" class="truncate">{{ item.label }}</span>
  </RouterLink>

  <RouterLink
    v-else-if="item.type === 'link'"
    :to="item.to"
    class="flex items-center px-3 py-1.5 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-white"
    :class="[
      depth > 1 ? 'pl-2' : '',
      { 'bg-sidebar-accent text-white font-medium': isPathActive(currentPath, item.to) }
    ]"
  >
    <span class="truncate">{{ item.label }}</span>
  </RouterLink>

  <div v-else-if="item.type === 'group'" class="space-y-0.5">
    <button
      type="button"
      @click="onToggle(item.name)"
      class="w-full flex items-center gap-2 rounded-md text-sm transition-colors hover:bg-sidebar-accent hover:text-white"
      :class="[
        depth === 0 ? 'px-3 py-2 font-medium gap-3' : 'px-3 py-1.5 text-sidebar-foreground/90',
        { 'bg-sidebar-accent/60 text-white': isItemActive(currentPath, item) }
      ]"
      :title="!sidebarOpen && depth === 0 ? item.label : undefined"
    >
      <component v-if="depth === 0 && item.icon" :is="item.icon" class="w-5 h-5 shrink-0" />
      <span v-if="sidebarOpen || depth > 0" class="truncate flex-1 text-left">{{ item.label }}</span>
      <ChevronDown
        v-if="sidebarOpen"
        class="w-3.5 h-3.5 shrink-0 transition-transform duration-200 opacity-70"
        :class="{ '-rotate-90': !isExpanded(item.name) }"
      />
    </button>

    <div
      v-if="sidebarOpen && isExpanded(item.name)"
      class="space-y-0.5 border-l border-sidebar-border"
      :class="depth === 0 ? 'ml-4 pl-2' : 'ml-3 pl-2'"
    >
      <NavMenuItem
        v-for="child in item.children"
        :key="child.name"
        :item="child"
        :depth="depth + 1"
        :sidebar-open="sidebarOpen"
        :current-path="currentPath"
        :is-expanded="isExpanded"
        :on-toggle="onToggle"
      />
    </div>
  </div>
</template>

<script setup>
import { ChevronDown } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { isPathActive, isItemActive } from '@/config/navigation'
import NavMenuItem from './NavMenuItem.vue'

defineProps({
  item: { type: Object, required: true },
  depth: { type: Number, default: 0 },
  sidebarOpen: Boolean,
  currentPath: { type: String, required: true },
  isExpanded: { type: Function, required: true },
  onToggle: { type: Function, required: true }
})
</script>
