<template>
  <div class="text-center py-24 text-muted-foreground">
    <component :is="icon" class="w-12 h-12 mx-auto mb-4 opacity-30" />
    <h2 class="text-lg font-semibold text-foreground">{{ title }}</h2>
    <p class="text-sm mt-1">Módulo em construção</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Construction } from 'lucide-vue-next'

const route = useRoute()

const title = computed(() => route.meta.moduleTitle || 'Módulo')
const icon = Construction
</script>
