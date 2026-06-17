<template>
  <template v-if="item.type === 'title'">
    <p
      v-if="sidebarOpen"
      class="px-4 pt-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400/70 first:pt-2"
    >
      {{ item.label }}
    </p>
  </template>

  <RouterLink
    v-else-if="item.type === 'link' && depth === 0"
    :to="item.to"
    class="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-800 hover:text-white"
    :class="{ 'bg-slate-800 text-white': isPathActive(currentPath, item.to) }"
    :title="!sidebarOpen ? item.label : undefined"
  >
    <component :is="item.icon" class="w-5 h-5 shrink-0 opacity-95" />
    <span v-if="sidebarOpen" class="truncate">{{ item.label }}</span>
  </RouterLink>

  <RouterLink
    v-else-if="item.type === 'link'"
    :to="item.to"
    class="flex items-center px-3 py-2 rounded-md text-sm text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
    :class="[
      depth > 1 ? 'pl-3' : '',
      { 'bg-slate-800 text-white font-medium': isPathActive(currentPath, item.to) }
    ]"
  >
    <span class="truncate">{{ item.label }}</span>
  </RouterLink>

  <div v-else-if="item.type === 'group'" class="space-y-1">
    <button
      type="button"
      @click="onToggle(item.name)"
      class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-800 hover:text-white"
      :class="{ 'bg-slate-800 text-white': isItemActive(currentPath, item) }"
      :title="!sidebarOpen && depth === 0 ? item.label : undefined"
    >
      <component v-if="depth === 0 && item.icon" :is="item.icon" class="w-5 h-5 shrink-0 opacity-95" />
      <span v-if="sidebarOpen || depth > 0" class="truncate flex-1 text-left">{{ item.label }}</span>
      <ChevronDown
        v-if="sidebarOpen"
        class="w-3.5 h-3.5 shrink-0 transition-transform duration-200 opacity-70"
        :class="{ '-rotate-90': !isExpanded(item.name) }"
      />
    </button>

    <div
      v-if="sidebarOpen && isExpanded(item.name)"
      class="space-y-1 border-l border-slate-800"
      :class="depth === 0 ? 'ml-5 pl-3' : 'ml-4 pl-3'"
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
