<template>
  <ModalWrapper v-model="visible" title="Detalhes da Entidade" width="large">
    <div v-if="currentEntidade" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-card border border-border rounded-xl p-4">
        <div class="space-y-2">
          <div>
            <div class="text-xs text-muted-foreground">Tipo</div>
            <div class="font-medium">{{ currentEntidade.tipo || '-' }}</div>
          </div>

          <div>
            <div class="text-xs text-muted-foreground">Nº Entidade</div>
            <div class="font-medium">{{ currentEntidade.num_entidade || '-' }}</div>
          </div>

          <div>
            <div class="text-xs text-muted-foreground">Nome</div>
            <div class="font-medium">{{ currentEntidade.nome || '-' }}</div>
          </div>

          <div>
            <div class="text-xs text-muted-foreground">Email</div>
            <div class="font-medium">{{ currentEntidade.email || '-' }}</div>
          </div>

          <div>
            <div class="text-xs text-muted-foreground">Telefone</div>
            <div class="font-medium">{{ currentEntidade.telefone || '-' }}</div>
          </div>
        </div>
      </div>

      <div class="bg-card border border-border rounded-xl p-4">
        <div class="space-y-2">
          <div>
            <div class="text-xs text-muted-foreground">Nº BI</div>
            <div class="font-medium">{{ currentEntidade.num_bi || '-' }}</div>
          </div>

          <div>
            <div class="text-xs text-muted-foreground">Data Emissão BI</div>
            <div class="font-medium">{{ formatDate(currentEntidade.data_emissao) }}</div>
          </div>

          <div>
            <div class="text-xs text-muted-foreground">Nº Passaporte</div>
            <div class="font-medium">{{ currentEntidade.num_passaporte || '-' }}</div>
          </div>

          <div>
            <div class="text-xs text-muted-foreground">Data Expiração</div>
            <div class="font-medium">{{ formatDate(currentEntidade.data_expiracao) }}</div>
          </div>

          <div>
            <div class="text-xs text-muted-foreground">Estado Civil</div>
            <div class="font-medium">{{ getEstadoCivilLabel(currentEntidade.estado_civil) }}</div>
          </div>

          <div>
            <div class="text-xs text-muted-foreground">Género</div>
            <div class="font-medium">
              {{
                currentEntidade.genero === 'M'
                  ? 'Masculino'
                  : currentEntidade.genero === 'F'
                    ? 'Feminino'
                    : '-'
              }}
            </div>
          </div>

          <div>
            <div class="text-xs text-muted-foreground">Data Nascimento</div>
            <div class="font-medium">{{ formatDate(currentEntidade.data_nascimento) }}</div>
          </div>
        </div>
      </div>

      <div class="bg-card border border-border rounded-xl p-4 md:col-span-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-xs text-muted-foreground">Endereço</div>
            <div class="font-medium">{{ currentEntidade.endereco || '-' }}</div>
          </div>

          <div>
            <div class="text-xs text-muted-foreground">NIF</div>
            <div class="font-medium">{{ currentEntidade.nif || '-' }}</div>
          </div>

          <div class="md:col-span-2">
            <div class="text-xs text-muted-foreground">Razão Social</div>
            <div class="font-medium">{{ currentEntidade.razao_social || '-' }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10 text-muted-foreground">
      Entidade não encontrada.
    </div>

    <template #actions>
      <button
        type="button"
        @click="visible = false"
        class="px-4 py-2 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Fechar
      </button>
    </template>
  </ModalWrapper>
</template>

<script setup>
import { computed } from 'vue'
import ModalWrapper from '@/components/common/ModalWrapper.vue'
import { getEstadoCivilLabel, formatDate } from '@/utils/entidadeLabels'

const props = defineProps({
  modelValue: Boolean,
  // compatibilidade: o Index está passando :Entidade (E maiúsculo)
  Entidade: { type: Object, default: null },
  entidade: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const currentEntidade = computed(() => props.Entidade ?? props.entidade)
</script>
