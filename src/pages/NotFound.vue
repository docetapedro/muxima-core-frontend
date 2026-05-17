<template>
  <div class="min-h-screen flex items-center justify-center bg-muted/30">
    <div class="text-center">
      <h1 class="text-8xl font-bold text-muted-foreground/30">404</h1>
      <h2 class="text-2xl font-bold mt-4">Página não encontrada</h2>
      <p class="text-muted-foreground mt-2">A página que procura não existe.</p>
      <RouterLink to="/" class="inline-block mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
        Voltar ao início
      </RouterLink>
    </div>
  </div>
</template>
<script setup>
import { RouterLink } from 'vue-router'
</script>
