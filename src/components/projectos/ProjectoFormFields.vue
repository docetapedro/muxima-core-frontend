<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">


        <div class="md:col-span-1 lg:col-span-1">
            <label class="text-sm font-medium mb-1 block">Tipo do Projecto *</label>
            <select v-model.number="formData.tipo_projecto" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                :class="{ 'border-red-500': validationErrors.tipo_projecto }">
                <option :value="null" disabled>Selecione o tipo...</option>
                <option v-for="t in tiposProjectos" :key="t.id ?? t.value ?? t" :value="t.id ?? t.value ?? t">
                    {{ t.nome ?? t.label ?? t.descricao ?? t.id ?? t.value ?? t }}
                </option>
            </select>
            <p v-if="validationErrors.tipo_projecto" class="text-xs text-red-600 mt-1">
                {{ validationErrors.tipo_projecto[0] }}
            </p>
            <div v-if="loadingTipos" class="text-xs text-muted-foreground mt-2">A carregar...</div>
        </div>

        <div class="md:col-span-1 lg:col-span-1">
            <label class="text-sm font-medium mb-1 block">Nome *</label>
            <input v-model="formData.nome" type="text" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                :class="{ 'border-red-500': validationErrors.nome }" />
            <p v-if="validationErrors.nome" class="text-xs text-red-600 mt-1">{{ validationErrors.nome[0] }}</p>
        </div>

        <div class="md:col-span-2 lg:col-span-2">
            <label class="text-sm font-medium mb-1 block">Descrição</label>
            <input v-model="formData.descricao" type="text"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                :class="{ 'border-red-500': validationErrors.descricao }" />
            <p v-if="validationErrors.descricao" class="text-xs text-red-600 mt-1">{{ validationErrors.descricao[0] }}
            </p>
        </div>


    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import tipoProjectoService from '@/services/tipoProjectoService'
import { getCachedLookup } from '@/composables/useLookupCache'

const props = defineProps({
    validationErrors: { type: Object, default: () => ({}) },
})

const formData = defineModel({ type: Object, required: true })

function parseItems(res) {
    const raw = res?.data?.dados?.items ?? res?.data?.dados ?? res?.data?.items ?? []
    if (!Array.isArray(raw)) return []
    return raw.filter((it) => it && (it.id != null || it.value != null))
}

const tiposProjectos = ref([])
const loadingTipos = ref(false)

async function loadTipos() {
    loadingTipos.value = true
    try {
        tiposProjectos.value = await getCachedLookup(
            'lookup:tipoProjectos',
            async () => parseItems(await tipoProjectoService.listar())
        )
    } finally {
        loadingTipos.value = false
    }
}

onMounted(() => {
    loadTipos()
})
</script>
