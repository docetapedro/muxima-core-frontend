<template>
  <div class="space-y-6 animate-fade-in">

    <!-- HEADER -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Detalhe do Imóvel</h1>
        <p class="text-muted-foreground text-sm">
          Informações completas do imóvel
        </p>
      </div>

      <RouterLink to="/imoveis" class="px-4 py-2 rounded-md bg-muted hover:bg-muted/70 text-sm">
        Voltar
      </RouterLink>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="space-y-4 animate-pulse">
      <div class="bg-card border border-border rounded-xl p-6 flex justify-between">
        <div class="space-y-2">
          <div class="h-5 w-48 bg-muted rounded"></div>
          <div class="h-4 w-64 bg-muted rounded"></div>
        </div>
        <div class="h-4 w-24 bg-muted rounded"></div>
      </div>

      <div class="h-96 bg-card border border-border rounded-xl"></div>
    </div>

    <!-- CONTENT -->
    <div v-else-if="imovel" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">

        <!-- LEFT: IMÓVEL (1 ÚNICO CARD) -->
        <aside class="lg:col-span-4 xl:col-span-3 space-y-4">
          <div class="bg-card border border-border rounded-xl p-5">
            <div class="flex items-start justify-between gap-4 mb-4">
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                  <span class="text-xl font-bold truncate">
                    {{ imovel.referencia }}
                  </span>

                  <span
                    class="px-2 py-1 text-xs rounded-full shrink-0"
                    :class="imovel.ocupado === 1 || imovel.ocupado === true || imovel.ocupado === '1'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-green-100 text-green-700'"
                  >
                    {{
                      imovel.ocupado === 1 || imovel.ocupado === true || imovel.ocupado === '1'
                        ? 'Ocupado'
                        : 'Disponível'
                    }}
                  </span>
                </div>

                <div class="flex gap-2 mt-3 flex-wrap">
                  <span class="px-2 py-1 rounded-full text-xs bg-muted">
                    Condomínio: {{ imovel.condominio?.nome || '-' }}
                  </span>
                </div>

                <div class="flex gap-2 mt-3 flex-wrap">
                  <span class="px-2 py-1 rounded-full text-xs bg-muted">
                    {{ imovel.tipoImovel?.nome || '-' }}
                    ·
                    {{ imovel.tipologia?.nome || '-' }}
                  </span>
                </div>

                <div class="flex gap-2 mt-3 flex-wrap">
                  <span class="px-2 py-1 rounded-full text-xs bg-muted">
                    Data de Criação:
                    {{ imovel.created_at }}
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-2">
              <h2 class="text-sm font-semibold mb-3">Área & Localização</h2>

              <!-- Um único card: sem “cards” internos -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <p class="text-xs text-muted-foreground mb-1">Área do Lote</p>
                  <p class="font-medium">{{ imovel.area_lote || '0,00' }}</p>
                </div>

                <div>
                  <p class="text-xs text-muted-foreground mb-1">Andar</p>
                  <p class="font-medium">{{ imovel.andar || '-' }}</p>
                </div>

                <div>
                  <p class="text-xs text-muted-foreground mb-1">Porta</p>
                  <p class="font-medium">{{ imovel.porta || '-' }}</p>
                </div>

                <div>
                  <p class="text-xs text-muted-foreground mb-1">Quadra</p>
                  <p class="font-medium">{{ imovel.quadra || '-' }}</p>
                </div>

                <div>
                  <p class="text-xs text-muted-foreground mb-1">Lote</p>
                  <p class="font-medium">{{ imovel.lote || '-' }}</p>
                </div>

                <div>
                  <p class="text-xs text-muted-foreground mb-1">Placa</p>
                  <p class="font-medium">{{ imovel.placa || '-' }}</p>
                </div>

                <div>
                  <p class="text-xs text-muted-foreground mb-1">Latitude</p>
                  <p class="font-medium">{{ imovel.latitude ?? '-' }}</p>
                </div>

                <div>
                  <p class="text-xs text-muted-foreground mb-1">Longitude</p>
                  <p class="font-medium">{{ imovel.longitude ?? '-' }}</p>
                </div>

                <div class="md:col-span-2">
                  <p class="text-xs text-muted-foreground mb-1">Altitude</p>
                  <p class="font-medium">{{ imovel.altitude ?? '-' }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="imovel.media?.length" class="bg-card border border-border rounded-xl p-5">
            <h2 class="text-base font-semibold mb-3">Ficheiros</h2>

            <div class="grid grid-cols-2 gap-3">
              <a v-for="media in imovel.media" :key="media.id" :href="media.original_url" target="_blank"
                class="border border-border rounded-lg overflow-hidden hover:opacity-80 transition">
                <img :src="media.preview_url || media.original_url" class="w-full h-24 object-cover"
                  alt="Ficheiro do imóvel" />
              </a>
            </div>
          </div>
        </aside>

        <!-- RIGHT: TABS VERTICAIS -->
        <main class="lg:col-span-8 xl:col-span-9 space-y-4">
          <div class="bg-card border border-border rounded-xl p-4">
            <div class="grid grid-cols-12 gap-4">
              <!-- Tab list (vertical) -->
              <div class="col-span-4">
                <h2 class="text-sm font-semibold mb-3">Secções</h2>

                <div class="space-y-2">
                  <button v-for="tab in tabs" :key="tab.value" type="button"
                    class="w-full text-left border border-border rounded-lg px-3 py-2 transition hover:opacity-90"
                    :class="activeTab === tab.value
                      ? 'bg-foreground text-background'
                      : 'bg-card text-foreground'" @click="activeTab = tab.value">
                    {{ tab.label }}
                  </button>
                </div>
              </div>

              <!-- Tab content -->
              <div class="col-span-8">
                <h2 class="text-sm font-semibold mb-2">{{ activeTabLabel }}</h2>

                <!-- NEGOCIAÇÕES -->
                <div v-if="activeTab === 'negociacoes'" class="space-y-4">
                  <div class="flex items-center justify-between gap-3 flex-wrap">
                    <p class="text-muted-foreground text-sm">
                      {{ (imovel.negociacoes?.length || 0) }} negociação(ões)
                    </p>

                    <button type="button"
                      class="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      @click="showCreateModal = true">
                      Nova negociação
                    </button>
                  </div>

                  <div v-if="!(imovel.negociacoes?.length)"
                    class="text-muted-foreground text-sm py-6 text-center border border-border rounded-lg bg-muted/10">
                    Nenhuma negociação ainda.
                  </div>

                  <div v-else class="space-y-2">
                    <div v-for="neg in imovel.negociacoes" :key="neg.id"
                      class="bg-muted/20 border border-border rounded-lg p-3">
                      <!-- Linha compacta: info + badge + 2 botões -->
                      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                        <!-- Info -->
                        <div class="md:col-span-8 min-w-0">
                          <p class="text-xs text-muted-foreground mb-1">Nº</p>
                          <p class="font-medium truncate">{{ neg.numero || '-' }}</p>

                          <p class="text-sm text-muted-foreground mt-1 truncate">
                            Estado: {{ estadoLabel(neg.estado) }} · Venda: {{
                              neg.valor_venda == null ? '-' : converteParaMonetario(neg.valor_venda)
                            }}
                          </p>

                          <p class="text-xs text-muted-foreground mt-1 truncate" v-if="neg.periodicidade">
                            Periodicidade: {{ neg.periodicidade }}
                          </p>

                          <!-- Badge abaixo do texto -->
                          <div class="mt-2 flex">
                            <span class="px-2 py-1 text-xs rounded-full whitespace-nowrap"
                              :class="neg.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'">
                              {{ neg.activo ? 'Activa' : 'Inactiva' }}
                            </span>
                          </div>
                        </div>

                        <!-- Botões (linha separada) -->
                        <div class="md:col-span-4 flex gap-2 justify-start md:justify-end items-start pt-1">
                          <button type="button"
                            class="px-3 py-2 rounded-md border border-border hover:bg-muted/30 text-sm"
                            @click="openNegotiationDetails(neg)">
                            Detalhes
                          </button>

                          <button type="button"
                            class="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
                            @click="openNegotiationEdit(neg)">
                            Editar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- FINANCEIRO (planoPagamento vem dentro das negociações) -->
                <div v-else-if="activeTab === 'financeiro'" class="space-y-4">
                  <div class="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 class="text-base font-semibold mb-1">Plano de Pagamento</h3>
                      <p class="text-muted-foreground text-sm">
                        {{ planoPagamentoItems.length }} lançamento(s) no total
                      </p>
                    </div>

                    <div class="min-w-[240px]">
                      <label class="text-xs text-muted-foreground block mb-1">Filtrar por negociação</label>
                      <select
                        v-model="selectedNegociacaoId"
                        class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                      >
                        <option :value="null">Todas</option>
                        <option
                          v-for="neg in imovel.negociacoes || []"
                          :key="neg.id"
                          :value="neg.id"
                        >
                          {{ neg.numero || '-' }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div v-if="!planoPagamentoFilteredItems.length"
                    class="text-muted-foreground text-sm py-6 text-center border border-border rounded-lg bg-muted/10">
                    Nenhum plano de pagamento encontrado para o filtro.
                  </div>

                  <div v-else class="border border-border rounded-xl overflow-hidden">
                    <!-- Header -->
                    <div class="grid grid-cols-12 gap-2 bg-muted/20 px-3 py-2 text-xs font-semibold border-b border-border">
                      <div class="col-span-1">Ano</div>
                      <div class="col-span-1">Mês</div>
                      <div class="col-span-2">Por pagar</div>
                      <div class="col-span-2">Valor Pago</div>
                      <div class="col-span-2">Vencimento</div>
                      <div class="col-span-2">Estado</div>
                      <div class="col-span-2">Situação</div>
                    </div>

                    <!-- Rows -->
                    <div
                      v-for="item in planoPagamentoFilteredItems"
                      :key="item.key"
                      class="grid grid-cols-12 gap-2 px-3 py-2 border-b border-border items-center"
                    >
                      <div class="col-span-1 text-sm font-medium">{{ item.ano ?? '-' }}</div>
                      <div class="col-span-1 text-sm font-medium">{{ item.mes ?? '-' }}</div>
                      <div class="col-span-2 text-sm">{{ item.por_pagar || '0,00' }}</div>
                      <div class="col-span-2 text-sm">{{ item.valor_pago || '0,00' }}</div>
                      <div class="col-span-2 text-sm">{{ item.data_vencimento || '-' }}</div>
                      <div class="col-span-2 text-sm">{{ item.estado || '-' }}</div>
                      <div class="col-span-2">
                        <span
                          class="px-2 py-1 text-xs rounded-full whitespace-nowrap"
                          :class="item.situacao === 'Pago'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'"
                        >
                          {{ item.situacao || '-' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- OUTROS TABS (placeholder) -->
                <div v-else class="text-muted-foreground text-sm space-y-2">
                  <p class="leading-relaxed">Área reservada para dados futuros.</p>
                  <p class="leading-relaxed">
                    (Depois iremos ligar o conteúdo real desta tab ao Imóvel — ex: tabelas.)
                  </p>
                </div>

              </div>
            </div>
          </div>
        </main>

      </div>
    </div>

    <!-- EMPTY -->
    <div v-else class="text-center py-20 text-muted-foreground">
      Imóvel não encontrado.
    </div>

    <!-- CREATE NEGOCIAÇÃO MODAL (simples) -->
    <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click.self="showCreateModal = false">
      <div class="w-full max-w-2xl bg-card border border-border rounded-xl p-4 space-y-4">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold">Nova negociação</h3>
        </div>

        <form class="space-y-3" @submit.prevent="createNegotiation">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="text-xs text-muted-foreground block mb-1">Nº do contrato</label>
              <input v-model="createForm.numero" type="text"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Estado</label>
              <select v-model="createForm.estado" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                <option value="">Selecione</option>
                <option value="RA">Rascunho</option>

              </select>
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Papel</label>
              <select v-model="createForm.papel"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" required>

                <option value="TI">TI - Titular</option>
              </select>
            </div>

            <div class="md:col-span-3">
              <label class="text-xs text-muted-foreground block mb-1">Entidade (filtrar)</label>

              <input v-model="entidadeSearch" type="text" placeholder="Filtrar pelo Nº Entidade, Nº BI, NIF ou Nome..."
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-2" />

              <select v-model="createForm.entidade_id"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" required>
                <option value="">Selecione</option>
                <option v-for="e in filteredEntidades" :key="e.id" :value="e.id">
                  {{ e.nome ?? '-' }} · {{ e.num_entidade ?? '-' }} · BI: {{ e.num_bi ?? '-' }} · NIF: {{ e.nif ?? e.NIF
                    ?? '-' }}
                </option>
              </select>
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Moeda</label>
              <select v-model="createForm.moeda_id"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                <option value="">Selecione</option>
                <option v-for="m in moedas" :key="m.id" :value="m.id">
                  {{ m.nome || m.codigo || m.id }}
                </option>
              </select>
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Valor venda *</label>
              <input v-model="createForm.valor_venda" type="number" step="0.01" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Desconto</label>
              <input v-model="createForm.desconto" type="number" step="0.01"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Nº Prestações *</label>
              <input v-model="createForm.num_prestacoes" type="number" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>

            <div class="md:col-span-1">
              <label class="text-xs text-muted-foreground block mb-1">Periodicidade</label>
              <select v-model="createForm.periodicidade"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                <option value="">Selecione</option>
                <option value="M">M - Mensal</option>
                <option value="T">T - Trimestral</option>
                <option value="S">S - Semestral</option>
                <option value="A">A - Anual</option>
              </select>
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Prestação *</label>
              <input v-model="createForm.prestacao" type="number" step="0.01" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Downpayment *</label>
              <input v-model.number="createForm.downpayment" type="number" step="0.01" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Data contrato *</label>
              <input v-model="createForm.data_contrato" type="date" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Data entrega</label>
              <input v-model="createForm.data_entrega" type="date"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>
          </div>

          <div class="flex items-center justify-between gap-3">
            <p v-if="createError" class="text-sm text-red-600">{{ createError }}</p>
            <span v-else class="text-sm text-muted-foreground"></span>

            <div class="flex items-center gap-2">
              <button type="button" class="px-4 py-2 rounded-md border border-border hover:bg-muted/30 text-sm"
                @click="showCreateModal = false" :disabled="createLoading">
                Cancelar
              </button>

              <button type="submit"
                class="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
                :disabled="createLoading">
                <span v-if="createLoading">A guardar...</span>
                <span v-else>Guardar</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <!-- NEGOCIAÇÃO: DETALHES -->
    <div v-if="showDetailsModal && selectedNegotiation"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      @click.self="showDetailsModal = false">
      <div class="w-full max-w-2xl bg-card border border-border rounded-xl p-4 space-y-4">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold">Detalhes da negociação</h3>
          <button type="button" class="px-3 py-2 rounded-md border border-border hover:bg-muted/30 text-sm"
            @click="showDetailsModal = false">
            Fechar
          </button>
        </div>

        <div class="space-y-3">
          <!-- Seção 1: Identificação / Valor -->
          <details class="rounded-lg border border-border p-3 bg-muted/10">
            <summary class="cursor-pointer select-none font-semibold text-sm">
              Identificação & Valor
            </summary>

            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Nº</p>
                <p class="font-medium">{{ selectedNegotiation.numero || '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Estado</p>
                <p class="font-medium">{{ estadoLabel(selectedNegotiation.estado) }}</p>
              </div>



              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Moeda </p>
                <p class="font-medium">{{ selectedNegotiation.moeda?.sigla ?? '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Valor venda</p>
                <p class="font-medium">
                  {{
                    selectedNegotiation.valor_venda == null
                      ? '-'
                      : converteParaMonetario(selectedNegotiation.valor_venda)
                  }}
                </p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Desconto</p>
                <p class="font-medium">{{ selectedNegotiation.desconto ?? '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Total merc</p>
                <p class="font-medium">{{ selectedNegotiation.total_merc ?? '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Nº de prestações</p>
                <p class="font-medium">{{ selectedNegotiation.num_prestacoes ?? '-' }}</p>
              </div>
            </div>
          </details>

          <!-- Seção 2: Finanças -->
          <details class="rounded-lg border border-border p-3 bg-muted/10">
            <summary class="cursor-pointer select-none font-semibold text-sm">
              Câmbio & Pagamento
            </summary>

            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Periodicidade</p>
                <p class="font-medium">{{ selectedNegotiation.periodicidade ?? '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Tipo câmbio</p>
                <p class="font-medium">{{ selectedNegotiation.tipo_cambio ?? '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Câmbio fixo USD</p>
                <p class="font-medium">{{ converteParaMonetario(selectedNegotiation.cambio_fixo_usd) ?? '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Câmbio fixo EUR</p>
                <p class="font-medium">{{ converteParaMonetario(selectedNegotiation.cambio_fixo_eur) ?? '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Prestação</p>
                <p class="font-medium">{{ converteParaMonetario(selectedNegotiation.prestacao) ?? '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Taxa de juro</p>
                <p class="font-medium">{{ converteParaMonetario(selectedNegotiation.taxa_de_juro) ?? '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Downpayment</p>
                <p class="font-medium">{{ converteParaMonetario(selectedNegotiation.downpayment) ?? '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Saldo acumulado</p>
                <p class="font-medium">{{ converteParaMonetario(selectedNegotiation.saldo_acumulado) ?? '-' }}</p>
              </div>
            </div>
          </details>

          <!-- Seção 3: Datas & Status -->
          <details class="rounded-lg border border-border p-3 bg-muted/10">
            <summary class="cursor-pointer select-none font-semibold text-sm">
              Datas & Status
            </summary>

            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Data contrato</p>
                <p class="font-medium">{{ selectedNegotiation.data_contrato ?? '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Data entrega</p>
                <p class="font-medium">{{ selectedNegotiation.data_entrega ?? '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3 md:col-span-2">
                <p class="text-xs text-muted-foreground mb-1">Activo</p>
                <p class="font-medium">{{ selectedNegotiation.activo ? 'Sim' : 'Não' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3 md:col-span-2">
                <p class="text-xs text-muted-foreground mb-1">Observação</p>
                <p class="text-sm">{{ selectedNegotiation.observacao || '-' }}</p>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>

    <!-- NEGOCIAÇÃO: EDITAR -->
    <div v-if="showEditModal && selectedNegotiation"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="showEditModal = false">
      <div class="w-full max-w-2xl bg-card border border-border rounded-xl p-4 space-y-4">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold">Editar negociação</h3>
          <button type="button" class="px-3 py-2 rounded-md border border-border hover:bg-muted/30 text-sm"
            @click="showEditModal = false">
            Fechar
          </button>
        </div>

        <form class="space-y-3" @submit.prevent="updateNegotiation">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="text-xs text-muted-foreground block mb-1">Nº Contrato</label>
              <input v-model="editForm.numero" type="text"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Estado</label>
              <select v-model="editForm.estado"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                <option value="">Selecione</option>
                <option value="RA">Rascunho</option>
                <option value="RE">Reservado</option>
                <option value="CA">Cancelado</option>
              </select>
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Papel</label>
              <select v-model="editForm.papel"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" required>
                <option value="TI">TI - Titular</option>
              </select>
            </div>

            <div class="md:col-span-3">
              <label class="text-xs text-muted-foreground block mb-1">Entidade</label>
              <select v-model="editForm.entidade_id"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                <option value="">Selecione</option>
                <option v-for="e in entidades" :key="e.id" :value="e.id">
                  {{ e.nome ?? '-' }} · {{ e.num_entidade ?? '-' }}
                </option>
              </select>
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Moeda</label>
              <select v-model="editForm.moeda_id"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                <option value="">Selecione</option>
                <option v-for="m in moedas" :key="m.id" :value="m.id">
                  {{ m.nome || m.codigo || m.id }}
                </option>
              </select>
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Valor venda *</label>
              <input v-model="editForm.valor_venda" type="number" step="0.01" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Desconto</label>
              <input v-model="editForm.desconto" type="number" step="0.01"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Nº de prestações *</label>
              <input v-model="editForm.num_prestacoes" type="number" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>

            <div class="md:col-span-1">
              <label class="text-xs text-muted-foreground block mb-1">Periodicidade</label>
              <select v-model="editForm.periodicidade"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                <option value="">Selecione</option>
                <option value="M">M - Mensal</option>
                <option value="T">T - Trimestral</option>
                <option value="S">S - Semestral</option>
                <option value="A">A - Anual</option>
              </select>
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Prestação *</label>
              <input v-model="editForm.prestacao" type="number" step="0.01" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Downpayment *</label>
              <input v-model.number="editForm.downpayment" type="number" step="0.01" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Data contrato *</label>
              <input v-model="editForm.data_contrato" type="date" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Data entrega</label>
              <input v-model="editForm.data_entrega" type="date"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm" />
            </div>
          </div>

          <div class="flex items-center justify-between gap-3">
            <p v-if="editError" class="text-sm text-red-600">{{ editError }}</p>
            <span v-else class="text-sm text-muted-foreground"></span>

            <div class="flex items-center gap-2">
              <button type="button" class="px-4 py-2 rounded-md border border-border hover:bg-muted/30 text-sm"
                @click="showEditModal = false" :disabled="editLoading">
                Cancelar
              </button>

              <button type="submit"
                class="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
                :disabled="editLoading">
                <span v-if="editLoading">A guardar...</span>
                <span v-else>Guardar</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import http from '@/api/http'
import { converteParaMonetario } from '@/utils/formatacao'

const route = useRoute()

const moedas = ref([])
const entidades = ref([])

const entidadeSearch = ref('')

const filteredEntidades = computed(() => {
  const q = (entidadeSearch.value || '').trim().toLowerCase()
  if (!q) return entidades.value

  return entidades.value.filter((e) => {
    const numEnt = String(e.num_entidade ?? e.numEntidade ?? '').toLowerCase()
    const numBi = String(e.num_bi ?? '').toLowerCase()
    const nif = String(e.nif ?? e.NIF ?? '').toLowerCase()
    const nome = String(e.nome ?? '').toLowerCase()

    return numEnt.includes(q) || numBi.includes(q) || nif.includes(q) || nome.includes(q)
  })
})

const papeis = ref([
  { value: 'VE', label: 'VE - Vendedor' },
  { value: 'CO', label: 'CO - Comprador' },
  { value: 'FI', label: 'FI - Fiador' },
  { value: 'TI', label: 'TI - Titular' },
  { value: 'PR', label: 'PR - Procurador' },
  { value: 'TE', label: 'TE - Testemunha' },
])

const imovel = ref(null)
const loading = ref(false)

/* TABS */
const tabs = ref([
  { value: 'resumo', label: 'Resumo' },
  { value: 'negociacoes', label: 'Negociações' },
  { value: 'financeiro', label: 'Financeiro' },
  { value: 'documentos', label: 'Documentos' },
  { value: 'historico', label: 'Histórico' }
])

const activeTab = ref('resumo')

const activeTabLabel = computed(() => {
  return tabs.value.find((t) => t.value === activeTab.value)?.label || '-'
})

const selectedNegociacaoId = ref(null)

const planoPagamentoItems = computed(() => {
  const negociacoes = Array.isArray(imovel.value?.negociacoes) ? imovel.value.negociacoes : []

  return negociacoes.flatMap((neg) => {
    const plano = Array.isArray(neg?.planoPagamento) ? neg.planoPagamento : []

    return plano.map((p, idx) => ({
      key: `${neg?.id ?? 'neg'}-${p?.ano ?? ''}-${p?.mes ?? ''}-${idx}`,
      negociacao_id: neg?.id ?? null,
      negociacao_numero: neg?.numero ?? null,
      ano: p?.ano ?? null,
      mes: p?.mes ?? null,
      valor_pago: p?.valor_pago ?? null,
      por_pagar: p?.por_pagar ?? null,
      data_vencimento: p?.data_vencimento ?? null,
      estado: p?.estado ?? null,
      situacao: p?.situacao ?? null
    }))
  })
})

const planoPagamentoFilteredItems = computed(() => {
  if (!selectedNegociacaoId.value) return planoPagamentoItems.value

  return planoPagamentoItems.value.filter(
    (item) => item.negociacao_id === selectedNegociacaoId.value
  )
})

/* FETCH */
const loadImovel = async (id) => {
  if (!id) return

  loading.value = true

  try {
    // moedas (para o select)
    if (!moedas.value.length) {
      try {
        const resMoedas = await http.get('/api/moedas')
        const dados = resMoedas?.data?.dados
        const items = Array.isArray(dados?.items) ? dados.items
          : (Array.isArray(dados) ? dados : [])
        moedas.value = items
      } catch (e) {
        console.error(e)
        moedas.value = []
      }
    }

    // entidades (para o select)
    if (!entidades.value.length) {
      try {
        const resEnt = await http.get('/api/entidades')
        const dados = resEnt?.data?.dados
        const items = Array.isArray(dados?.items) ? dados.items
          : (Array.isArray(dados) ? dados : [])
        entidades.value = items
      } catch (e) {
        console.error(e)
        entidades.value = []
      }
    }

    // imóvel (com negociacoes)
    const res = await http.get(`/api/imoveis/${id}`)
    imovel.value = res.data.dados || null
  } catch (e) {
    console.error(e)
    imovel.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadImovel(route.params.id)
})

watch(
  () => route.params.id,
  (newId) => {
    if (!newId) return
    loadImovel(newId)
  }
)

/* CREATE NEGOCIAÇÃO */
const showCreateModal = ref(false)
const createLoading = ref(false)
const createError = ref('')

const createForm = ref({
  numero: '',
  estado: '',
  moeda_id: null,
  valor_venda: null,
  desconto: 0,
  total_merc: null,
  num_prestacoes: null,
  periodicidade: '',
  tipo_cambio: null,
  cambio_fixo_usd: null,
  cambio_fixo_eur: null,
  prestacao: null,
  taxa_de_juro: null,
  downpayment: null,
  saldo_acumulado: null,
  data_contrato: '',
  data_entrega: '',
  observacao: '',
  activo: true,

  // pivot negociacao_entidades
  entidade_id: null,
  papel: 'VE',

  // vinda do imovel
  imovel_id: null
})

function resetCreateForm() {
  createForm.value = {
    numero: '',
    estado: '',
    moeda_id: null,
    valor_venda: null,
    desconto: 0,
    total_merc: null,
    num_prestacoes: null,
    periodicidade: '',
    tipo_cambio: null,
    cambio_fixo_usd: null,
    cambio_fixo_eur: null,
    prestacao: null,
    taxa_de_juro: null,
    downpayment: null,
    saldo_acumulado: null,
    data_contrato: '',
    data_entrega: '',
    observacao: '',
    activo: true,
    imovel_id: imovel.value?.id ?? null
  }
}

watch(showCreateModal, (v) => {
  if (v) {
    resetCreateForm()
    createError.value = ''
  }
})

async function createNegotiation() {
  if (!imovel.value?.id) return

  createLoading.value = true
  createError.value = ''

  try {
    const payload = {
      // campos simples (raiz)
      imovel: imovel.value.id,
      numero: createForm.value.numero,
      estado: createForm.value.estado,
      moeda: createForm.value.moeda_id,
      valor_venda: createForm.value.valor_venda,
      desconto: createForm.value.desconto ?? 0,
      num_prestacoes: createForm.value.num_prestacoes,
      periodicidade: createForm.value.periodicidade,
      prestacao: createForm.value.prestacao,
      downpayment: createForm.value.downpayment,
      data_contrato: createForm.value.data_contrato || null,
      data_entrega: createForm.value.data_entrega || null,
      observacao: createForm.value.observacao,
      activo: createForm.value.activo,
      entidade: createForm.value.entidade_id,
      papel: createForm.value.papel
    }

    await http.post('/api/negociacaos', payload)

    showCreateModal.value = false
    await loadImovel(imovel.value.id)
  } catch (e) {
    console.error(e)
    // tentativa simples de extrair msg
    createError.value = e?.response?.data?.message || 'Falha ao criar negociação.'
  } finally {
    createLoading.value = false
  }
}

/* NEGOCIAÇÃO: DETALHES / EDITAR */
const selectedNegotiation = ref(null)
const showDetailsModal = ref(false)
const showEditModal = ref(false)

function openNegotiationDetails(neg) {
  selectedNegotiation.value = neg
  showDetailsModal.value = true
  showEditModal.value = false
}

const editLoading = ref(false)
const editError = ref('')

const editForm = ref({
  numero: '',
  estado: '',
  moeda: null,
  valor_venda: null,
  desconto: 0,
  num_prestacoes: null,
  periodicidade: '',
  prestacao: null,
  downpayment: null,
  data_contrato: '',
  data_entrega: '',
  entidade_id: null,
  papel: 'TI'
})

function getPivotPrincipal(neg) {
  const pivots = Array.isArray(neg?.negociacao_entidades) ? neg.negociacao_entidades : []
  return pivots.find((p) => p?.principal) || pivots[0] || null
}

function openNegotiationEdit(neg) {
  selectedNegotiation.value = neg
  showEditModal.value = true
  showDetailsModal.value = false

  const pivot = getPivotPrincipal(neg)

  editError.value = ''
  editForm.value = {
    numero: neg?.numero ?? '',
    estado: neg?.estado ?? '',
    moeda: neg?.moeda_id ?? null,
    valor_venda: neg?.valor_venda ?? null,
    desconto: neg?.desconto ?? 0,
    num_prestacoes: neg?.num_prestacoes ?? null,
    periodicidade: neg?.periodicidade ?? '',
    prestacao: neg?.prestacao ?? null,
    downpayment: neg?.downpayment ?? null,
    data_contrato: neg?.data_contrato ?? '',
    data_entrega: neg?.data_entrega ?? '',
    entidade: pivot?.entidade_id ?? null,
    papel: pivot?.papel ?? 'TI'
  }
}

function estadoLabel(estado) {
  const map = {
    RA: 'Rascunho',
    RE: 'Reservado',
    AC: 'Activo',
    CA: 'Cancelado',
    CO: 'Concluído'
  }

  if (!estado) return '-'
  return map[estado] || estado
}

async function updateNegotiation() {
  if (!selectedNegotiation.value?.id) return
  if (!imovel.value?.id) return

  editLoading.value = true
  editError.value = ''

  try {
    const payload = {
      // campos simples (raiz)
      imovel: imovel.value.id,
      numero: editForm.value.numero,
      estado: editForm.value.estado,
      moeda: editForm.value.moeda_id,
      valor_venda: editForm.value.valor_venda,
      desconto: editForm.value.desconto ?? 0,
      num_prestacoes: editForm.value.num_prestacoes,
      periodicidade: editForm.value.periodicidade,
      prestacao: editForm.value.prestacao,
      downpayment: editForm.value.downpayment,
      data_contrato: editForm.value.data_contrato || null,
      data_entrega: editForm.value.data_entrega || null,
      observacao: selectedNegotiation.value?.observacao ?? null,
      entidade: editForm.value.entidade_id,
      papel: editForm.value.papel,
      activo: selectedNegotiation.value?.activo ?? true
    }

    await http.put(`/api/negociacaos/${selectedNegotiation.value.id}`, payload)

    showEditModal.value = false
    await loadImovel(imovel.value.id)
  } catch (e) {
    console.error(e)
    editError.value = e?.response?.data?.message || 'Falha ao editar negociação.'
  } finally {
    editLoading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
