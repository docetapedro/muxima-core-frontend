<template>
  <RouterView />
  <Toaster richColors />
</template>

<script setup>
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
</script>
