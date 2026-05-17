<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- Tipo -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="text-sm font-medium mb-1 block">Tipo *</label>
      <select v-model="formData.tipo" required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.tipo }">
        <option value="P">Pessoa</option>
        <option value="E">Empresa</option>
      </select>
      <p v-if="validationErrors.tipo" class="text-xs text-red-600 mt-1">
        {{ validationErrors.tipo[0] }}
      </p>
    </div>

    <!-- Num entidade -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="text-sm font-medium mb-1 block">Nº Entidade </label>
      <input v-model="formData.num_entidade" type="text"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.num_entidade }" />
      <p v-if="validationErrors.num_entidade" class="text-xs text-red-600 mt-1">
        {{ validationErrors.num_entidade[0] }}
      </p>
    </div>

    <!-- Nome -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="text-sm font-medium mb-1 block">Nome *</label>
      <input v-model="formData.nome" type="text" required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.nome }" />
      <p v-if="validationErrors.nome" class="text-xs text-red-600 mt-1">{{ validationErrors.nome[0] }}</p>
    </div>

    <!-- Email -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="text-sm font-medium mb-1 block">Email *</label>
      <input v-model="formData.email" type="email" required
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.email }" />
      <p v-if="validationErrors.email" class="text-xs text-red-600 mt-1">{{ validationErrors.email[0] }}</p>
    </div>

    <!-- Telefone -->
    <div class="md:col-span-1 lg:col-span-1">
      <label class="text-sm font-medium mb-1 block">Telefone</label>
      <input v-model="formData.telefone" type="text"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.telefone }" />
      <p v-if="validationErrors.telefone" class="text-xs text-red-600 mt-1">{{ validationErrors.telefone[0] }}</p>
    </div>

    <!-- Endereço -->
  

    <!-- Campos Pessoa -->
    <template v-if="formData.tipo === 'P'">


      <div class="md:col-span-1 lg:col-span-1">
        <label class="text-sm font-medium mb-1 block">Data Nascimento</label>
        <input v-model="formData.data_nascimento" type="date"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.data_nascimento }" />
        <p v-if="validationErrors.data_nascimento" class="text-xs text-red-600 mt-1">
          {{ validationErrors.data_nascimento[0] }}
        </p>
      </div>

       <!-- Estado civil -->
      <div class="md:col-span-1 lg:col-span-1">
        <label class="text-sm font-medium mb-1 block">Estado Civil</label>
        <select v-model="formData.estado_civil"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.estado_civil }">
          <option value="">Selecionar</option>
          <option value="SO">Solteiro(a)</option>
          <option value="CA">Casado(a)</option>
          <option value="DI">Divorciado(a)</option>
          <option value="VI">Viúvo(a)</option>
        </select>
        <p v-if="validationErrors.estado_civil" class="text-xs text-red-600 mt-1">
          {{ validationErrors.estado_civil[0] }}
        </p>
      </div>

      <!-- Género -->
      <div class="md:col-span-1 lg:col-span-1">
        <label class="text-sm font-medium mb-1 block">Género</label>
        <select v-model="formData.genero"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.genero }">
          <option value="">Selecionar</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
        <p v-if="validationErrors.genero" class="text-xs text-red-600 mt-1">{{ validationErrors.genero[0] }}</p>
      </div>

      <!-- Data nascimento -->
      

      <!-- Nº BI -->
      <div class="md:col-span-1 lg:col-span-1">
        <label class="text-sm font-medium mb-1 block">Nº BI</label>
        <input v-model="formData.num_bi" type="text"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.num_bi }" />
        <p v-if="validationErrors.num_bi" class="text-xs text-red-600 mt-1">{{ validationErrors.num_bi[0] }}</p>
      </div>

      <!-- NIF -->
      <div v-if="formData.tipo === 'P' || formData.tipo === 'E'" class="md:col-span-1 lg:col-span-1">
        <label class="text-sm font-medium mb-1 block">NIF</label>

        <input v-model="formData.nif" type="text" :readonly="formData.tipo === 'P'"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{
            'border-red-500': validationErrors.nif,
            'bg-muted cursor-not-allowed': formData.tipo === 'P'
          }" />

        <p v-if="validationErrors.nif" class="text-xs text-red-600 mt-1">
          {{ validationErrors.nif[0] }}
        </p>
      </div>

      <!-- Nº Passaporte -->
      <div class="md:col-span-1 lg:col-span-1">
        <label class="text-sm font-medium mb-1 block">Nº Passaporte</label>
        <input v-model="formData.num_passaporte" type="text"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.num_passaporte }" />
        <p v-if="validationErrors.num_passaporte" class="text-xs text-red-600 mt-1">
          {{ validationErrors.num_passaporte[0] }}
        </p>
      </div>

      <!-- Data emissão -->
      <div class="md:col-span-1 lg:col-span-1">
        <label class="text-sm font-medium mb-1 block">Data Emissão</label>
        <input v-model="formData.data_emissao" type="date"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.data_emissao }" />
        <p v-if="validationErrors.data_emissao" class="text-xs text-red-600 mt-1">
          {{ validationErrors.data_emissao[0] }}
        </p>
      </div>

      <!-- Data expiração -->
      <div class="md:col-span-1 lg:col-span-1">
        <label class="text-sm font-medium mb-1 block">Data Expiração</label>
        <input v-model="formData.data_expiracao" type="date"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.data_expiracao }" />
        <p v-if="validationErrors.data_expiracao" class="text-xs text-red-600 mt-1">
          {{ validationErrors.data_expiracao[0] }}
        </p>
      </div>

     
    </template>

    <!-- Campos Entidade -->
    <template v-else-if="formData.tipo === 'E'">
     


      <div class="md:col-span-2 lg:col-span-2">
        <label class="text-sm font-medium mb-1 block">Razão Social</label>
        <input v-model="formData.razao_social" type="text"
          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          :class="{ 'border-red-500': validationErrors.razao_social }" />
        <p v-if="validationErrors.razao_social" class="text-xs text-red-600 mt-1">
          {{ validationErrors.razao_social[0] }}
        </p>
      </div>
    </template>


      <div class="md:col-span-2 lg:col-span-2">
      <label class="text-sm font-medium mb-1 block">Endereço</label>
      <input v-model="formData.endereco" type="text"
        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        :class="{ 'border-red-500': validationErrors.endereco }" />
      <p v-if="validationErrors.endereco" class="text-xs text-red-600 mt-1">{{ validationErrors.endereco[0] }}</p>
    </div>
  </div>
</template>

<script setup>

import { watch } from 'vue'

defineProps({
  validationErrors: { type: Object, default: () => ({}) }
})

const formData = defineModel({ type: Object, required: true })


watch(
  () => formData.value.num_bi,
  (value) => {
    if (formData.value.tipo === 'P') {
      formData.value.nif = value
    }
  }
)

</script>
