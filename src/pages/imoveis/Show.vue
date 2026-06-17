<template>
  <div class="min-h-[calc(100vh-4rem)] space-y-6 animate-fade-in">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Detalhe do Imóvel</h1>
        <p class="text-muted-foreground text-sm">Informações completas do imóvel</p>
      </div>

      <RouterLink to="/imoveis"
        class="px-4 py-2 rounded-md border border-border bg-card text-foreground shadow-sm hover:bg-muted/70 text-sm transition-colors">
        Voltar
      </RouterLink>
    </div>

    <div v-if="loading"
      class="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center"
      role="status" aria-live="polite">
      <div class="relative">
        <div class="w-20 h-20 rounded-full border-4 border-primary/20"></div>
        <Loader2 class="w-20 h-20 absolute inset-0 animate-spin text-primary" />
      </div>
      <div class="space-y-1">
        <p class="text-base font-semibold">A carregar imóvel...</p>
        <p class="text-sm text-muted-foreground">Por favor, aguarde.</p>
      </div>
    </div>

    <div v-else-if="imovel" class="space-y-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <aside class="lg:col-span-4 xl:col-span-3 space-y-4">
          <div class="bg-card border border-border rounded-xl p-5">
            <div class="flex items-start justify-between gap-4 mb-4">
              <div class="min-w-0">
                <div class="flex items-center gap-2 mb-2 flex-wrap">
                  <span class="text-xl font-bold truncate">{{ imovel.referencia }}</span>

                  <span class="px-2 py-1 text-xs rounded-full shrink-0" :class="imovel.ocupado === 1 || imovel.ocupado === true || imovel.ocupado === '1'
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200'
                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'">
                    {{
                      imovel.ocupado === 1 || imovel.ocupado === true || imovel.ocupado === '1'
                        ? 'Ocupado'
                        : 'Disponível'
                    }}
                  </span>
                </div>

                <div v-if="titularAtivo.nome || titularAtivo.numEntidade" class="flex gap-2 mt-3 flex-wrap">
                  <span
                    class="px-3 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary border border-primary/30 inline-flex items-center gap-1.5">
                    <User class="w-4 h-4 shrink-0" />
                    <span class="truncate">
                      {{ titularAtivo.nome || '-' }}<span v-if="titularAtivo.numEntidade"
                        class="font-normal opacity-80"> · Nº {{ titularAtivo.numEntidade }}</span>
                    </span>
                  </span>
                </div>

                <div class="flex gap-2 mt-3 flex-wrap">
                  <span class="px-2 py-1 rounded-full text-xs bg-muted">Condomínio: {{ imovel.condominio?.nome || '-'
                    }}</span>
                </div>

                <div class="flex gap-2 mt-3 flex-wrap">
                  <span class="px-2 py-1 rounded-full text-xs bg-muted">
                    {{ imovel.tipoImovel?.nome || '-' }} · {{ imovel.tipologia?.nome || '-' }}
                  </span>
                </div>

                <div class="flex gap-2 mt-3 flex-wrap">
                  <span class="px-2 py-1 rounded-full text-xs bg-muted">
                    Data de Criação: {{ imovel.created_at }}
                  </span>
                </div>
              </div>
            </div>

            <div class="mt-2">
              <h2 class="text-sm font-semibold mb-3">Área & Localização</h2>

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

        <main class="lg:col-span-8 xl:col-span-9 space-y-4">
          <div class="bg-card border border-border rounded-xl p-4">
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-3 xl:col-span-2">
                <h2 class="text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Secções</h2>

                <div class="space-y-1">
                  <button v-for="tab in tabs" :key="tab.value" type="button"
                    class="w-full text-left border border-border rounded-md px-2 py-1.5 text-sm transition hover:opacity-90 flex items-center gap-2"
                    :class="activeTab === tab.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground'"
                    :title="tab.label" @click="activeTab = tab.value">
                    <component :is="tab.icon" class="w-4 h-4 shrink-0" />
                    <span class="truncate">{{ tab.label }}</span>
                  </button>
                </div>
              </div>

              <div class="col-span-9 xl:col-span-10">
                <h2 class="text-sm font-semibold mb-2">{{ activeTabLabel }}</h2>

                <div v-if="activeTab === 'resumo'" class="space-y-4">
                  <div v-if="!negociacaoAtivaImovel"
                    class="text-muted-foreground text-sm py-6 text-center border border-border rounded-lg bg-muted/10">
                    Este imóvel ainda não tem negociação activa.
                  </div>

                  <div v-else class="space-y-3">
                    <div class="flex items-start justify-between gap-3 flex-wrap">
                      <p class="text-sm font-semibold truncate">Nº {{ negociacaoAtivaImovel.numero || '-' }}</p>

                      <span
                        class="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-full whitespace-nowrap border"
                        :class="negociacaoEstadoMeta(negociacaoAtivaImovel.estado).classes">
                        <component :is="negociacaoEstadoMeta(negociacaoAtivaImovel.estado).icon" class="w-3.5 h-3.5" />
                        {{ negociacaoEstadoMeta(negociacaoAtivaImovel.estado).label }}
                      </span>
                    </div>

                    <div class="rounded-md border border-border bg-background px-3 py-2">
                      <p class="text-xs text-muted-foreground mb-0.5">Titular</p>
                      <p class="text-sm font-medium truncate">
                        {{ titularAtivo.nome || '-' }}
                        <span v-if="titularAtivo.numEntidade" class="text-muted-foreground font-normal">
                          · Nº {{ titularAtivo.numEntidade }}
                        </span>
                      </p>
                    </div>

                    <div class="grid grid-cols-2 border border-border rounded-md overflow-hidden">
                      <div
                        class="flex items-center justify-between gap-2 px-3 py-1.5 text-sm border-r border-b border-border">
                        <span class="text-muted-foreground"></span>
                        <span class="font-semibold text-foreground">
                          {{ converteParaMonetario(negociacaoAtivaTotais.totalVenda) }}
                        </span>
                      </div>
                      <div class="flex items-center justify-between gap-2 px-3 py-1.5 text-sm border-b border-border">
                        <span class="text-muted-foreground">Total desconto</span>
                        <span class="font-semibold text-amber-700 dark:text-amber-300">
                          {{ converteParaMonetario(negociacaoAtivaTotais.totalDesconto) }}
                        </span>
                      </div>

                      <div
                        class="flex items-center justify-between gap-2 px-3 py-1.5 text-sm border-r border-b border-border">
                        <span class="text-muted-foreground">Saldo acumulado</span>
                        <span class="font-semibold text-emerald-700 dark:text-emerald-300">
                          {{ converteParaMonetario(negociacaoAtivaImovel.saldo_acumulado ?? 0) }}
                        </span>
                      </div>
                      <div class="flex items-center justify-between gap-2 px-3 py-1.5 text-sm border-b border-border">
                        <span class="text-muted-foreground">Down Payment</span>
                        <span class="font-medium">{{ converteParaMonetario(negociacaoAtivaImovel.total_down_payment ?? 0)
                          }}</span>
                      </div>

                      <div class="flex items-center justify-between gap-2 px-3 py-1.5 text-sm border-r border-border">
                        <span class="text-muted-foreground">Data contrato</span>
                        <span class="font-medium">{{ negociacaoAtivaImovel.data_contrato || '-' }}</span>
                      </div>
                      <div class="flex items-center justify-between gap-2 px-3 py-1.5 text-sm">
                        <span class="text-muted-foreground">Data entrega</span>
                        <span class="font-medium">{{ negociacaoAtivaImovel.data_entrega || '-' }}</span>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <div class="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                        <span>Progresso do saldo</span>
                        <span>{{ formatProgressPercent(getNegotiacaoProgresso(negociacaoAtivaImovel)) }}%</span>
                      </div>

                      <div class="h-2 w-full rounded-full bg-background border border-border overflow-hidden">
                        <div class="h-full rounded-full bg-emerald-500 transition-all"
                          :style="{ width: `${getNegotiacaoProgresso(negociacaoAtivaImovel)}%` }"></div>
                      </div>
                    </div>

                    <div class="space-y-2">
                      <p class="text-sm font-semibold">Itens ({{ negociacaoAtivaItens.length }})</p>

                      <div v-if="!negociacaoAtivaItens.length"
                        class="text-xs text-muted-foreground border border-dashed border-border rounded-md py-3 text-center">
                        Sem itens registados nesta negociação.
                      </div>

                      <details v-for="(row, idx) in negociacaoAtivaItens" :key="row._key"
                        class="rounded-md border border-border bg-background">
                        <summary class="cursor-pointer select-none flex items-center justify-between px-3 py-2 text-sm">
                          <span class="font-medium truncate">
                            #{{ idx + 1 }} · {{ itemRowLabel(row) }}
                          </span>
                          <span class="text-xs text-muted-foreground whitespace-nowrap">
                            {{ row.valor || '-' }} · {{ row.periodicidade || '-' }}
                          </span>
                        </summary>

                        <div class="grid grid-cols-2 md:grid-cols-3 gap-2 px-3 pb-3 text-xs">
                          <div>
                            <p class="text-muted-foreground">Valor</p>
                            <p class="font-medium">{{ row.valor || '-' }}</p>
                          </div>
                          <div>
                            <p class="text-muted-foreground">Desconto</p>
                            <p class="font-medium">{{ row.desconto || '-' }}</p>
                          </div>
                          <div>
                            <p class="text-muted-foreground">Periodicidade</p>
                            <p class="font-medium">{{ row.periodicidade || '-' }}</p>
                          </div>
                          <div>
                            <p class="text-muted-foreground">Nº Prestações</p>
                            <p class="font-medium">{{ row.num_prestacoes ?? '-' }}</p>
                          </div>
                          <div>
                            <p class="text-muted-foreground">Prestação</p>
                            <p class="font-medium">{{ row.prestacao || '-' }}</p>
                          </div>
                          <div>
                            <p class="text-muted-foreground">Saldo acumulado</p>
                            <p class="font-medium text-emerald-700 dark:text-emerald-300">{{ row.saldo_acumulado || '-'
                              }}</p>
                          </div>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>

                <div v-else-if="activeTab === 'negociacoes'" class="space-y-4">
                  <div class="flex items-center justify-between gap-3 flex-wrap">
                    <p class="text-muted-foreground text-sm">
                      {{ negociacoesFiltradas.length }} negociação(ões)
                    </p>

                    <button v-if="!hasNegociacaoActiva" type="button"
                      class="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                      @click="openCreateNegotiationModal">
                      Nova negociação
                    </button>
                    <span v-else
                      class="text-xs text-muted-foreground italic"
                      title="Já existe uma negociação activa para este imóvel">
                      Imóvel com negociação activa
                    </span>
                  </div>

                  <div v-if="!negociacoesFiltradas.length"
                    class="text-muted-foreground text-sm py-6 text-center border border-border rounded-lg bg-muted/10">
                    Nenhuma negociação encontrada.
                  </div>

                  <div v-else class="space-y-2">
                    <div v-for="neg in negociacoesFiltradas" :key="neg.id"
                      class="border border-border rounded-lg p-3 transition-colors"
                      :class="negociacaoEstadoCardClass(neg.estado)">
                      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                        <div class="md:col-span-8 min-w-0">
                          <p class="text-xs text-muted-foreground mb-1">Nº</p>
                          <p class="font-medium truncate">{{ neg.numero || '-' }}</p>

                          <p class="text-sm text-muted-foreground mt-1 truncate">
                            Estado: {{ estadoLabel(neg.estado) }} · Total: {{
                              converteParaMonetario(getNegotiationTotal(neg)) }}
                          </p>

                          <p v-if="getTitularInfo(neg).nome || getTitularInfo(neg).numEntidade"
                            class="text-xs text-foreground mt-1 truncate">
                            <span class="text-muted-foreground">Titular:</span>
                            {{ getTitularInfo(neg).nome || '-' }}
                            <span v-if="getTitularInfo(neg).numEntidade" class="text-muted-foreground">
                              · Nº {{ getTitularInfo(neg).numEntidade }}
                            </span>
                          </p>

                          <p class="text-xs text-muted-foreground mt-1 truncate">
                            {{ negotiationItemsFromRecord(neg).length }} item(s)
                          </p>

                          <div class="mt-2 flex flex-wrap gap-2">
                            <span
                              class="inline-flex items-center gap-1.5 px-2 py-1 text-xs rounded-full whitespace-nowrap border"
                              :class="negociacaoEstadoMeta(neg.estado).classes">
                              <component :is="negociacaoEstadoMeta(neg.estado).icon" class="w-3.5 h-3.5" />
                              {{ negociacaoEstadoMeta(neg.estado).label }}
                            </span>

                            <template v-if="getNegotiationItemLabels(neg).length">
                              <span v-for="itemLabel in getNegotiationItemLabels(neg)" :key="`${neg.id}-${itemLabel}`"
                                class="inline-flex items-center px-2 py-1 text-xs rounded-full whitespace-nowrap bg-muted text-foreground border border-border">
                                {{ itemLabel }}
                              </span>
                            </template>
                          </div>
                        </div>

                        <div class="md:col-span-4 flex justify-start md:justify-end items-start pt-1">
                          <div class="relative actions-menu-container" :data-menu-id="neg.id">
                            <button type="button"
                              class="flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
                              @click.stop="toggleActionsMenu(neg.id)"
                              :aria-expanded="openActionsMenuId === neg.id">
                              <MoreHorizontal class="w-4 h-4" />
                              Ações
                              <ChevronDown class="w-3.5 h-3.5"
                                :class="{ 'rotate-180': openActionsMenuId === neg.id }" />
                            </button>

                            <div v-if="openActionsMenuId === neg.id"
                              class="absolute right-0 top-full mt-2 w-60 rounded-xl border-2 border-border bg-white text-slate-900 shadow-2xl ring-1 ring-black/10 dark:bg-slate-900 dark:text-slate-50 dark:ring-white/10 z-50 py-1 overflow-hidden"
                              @click.stop>
                              <div class="px-3 pt-2 pb-1 text-[10px] uppercase font-semibold text-muted-foreground tracking-wide">
                                Documentos
                              </div>

                              <button v-if="isRascunho(neg)" type="button"
                                :disabled="negociacaoPdfLoading[`${neg.id}-simulacao`]"
                                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-left disabled:opacity-50"
                                @click="runAndCloseMenu(() => gerarExtratoPdf(neg, 'simulacao'))">
                                <Loader2 v-if="negociacaoPdfLoading[`${neg.id}-simulacao`]" class="w-4 h-4 animate-spin" />
                                <FileText v-else class="w-4 h-4" />
                                Simulação (PDF)
                              </button>

                              <button v-if="!isRascunho(neg)" type="button"
                                :disabled="negociacaoPdfLoading[`${neg.id}-resumo`]"
                                class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left disabled:opacity-50"
                                @click="runAndCloseMenu(() => gerarExtratoPdf(neg, 'resumo'))">
                                <Loader2 v-if="negociacaoPdfLoading[`${neg.id}-resumo`]" class="w-4 h-4 animate-spin" />
                                <FileText v-else class="w-4 h-4" />
                                Resumo (PDF)
                              </button>

                              <button v-if="!isRascunho(neg)" type="button"
                                :disabled="negociacaoPdfLoading[`${neg.id}-detalhado`]"
                                class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left disabled:opacity-50"
                                @click="runAndCloseMenu(() => gerarExtratoPdf(neg, 'detalhado'))">
                                <Loader2 v-if="negociacaoPdfLoading[`${neg.id}-detalhado`]" class="w-4 h-4 animate-spin" />
                                <FileText v-else class="w-4 h-4" />
                                Detalhado (PDF)
                              </button>

                              <router-link v-if="!isRascunho(neg)"
                                :to="{ name: 'negociacoes.extrato-contas', params: { id: neg.id } }"
                                @click="openActionsMenuId = null"
                                class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left">
                                <Files class="w-4 h-4" />
                                Conta-corrente
                              </router-link>

                              <button v-if="isNegociacaoActiva(neg)" type="button"
                                :disabled="negociacaoPdfLoading[`${neg.id}-contrato`]"
                                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left disabled:opacity-50"
                                @click="runAndCloseMenu(() => gerarContratoPdf(neg))">
                                <Loader2 v-if="negociacaoPdfLoading[`${neg.id}-contrato`]" class="w-4 h-4 animate-spin" />
                                <FileText v-else class="w-4 h-4" />
                                Contrato (PDF)
                              </button>

                              <button v-if="podeImprimirTermoQuitacao(neg)" type="button"
                                :disabled="negociacaoPdfLoading[`${neg.id}-termo-quitacao`]"
                                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors text-left disabled:opacity-50"
                                @click="runAndCloseMenu(() => gerarTermoQuitacaoPdf(neg))">
                                <Loader2 v-if="negociacaoPdfLoading[`${neg.id}-termo-quitacao`]" class="w-4 h-4 animate-spin" />
                                <FileText v-else class="w-4 h-4" />
                                Termo de quitação (PDF)
                              </button>

                              <div class="border-t border-border/70 my-1"></div>

                              <div class="px-3 pt-1 pb-1 text-[10px] uppercase font-semibold text-muted-foreground tracking-wide">
                                Geral
                              </div>

                              <button type="button"
                                class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left"
                                @click="runAndCloseMenu(() => openNegotiationDetails(neg))">
                                <Info class="w-4 h-4" />
                                Detalhes
                              </button>

                              <button type="button"
                                class="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left font-medium"
                                @click="runAndCloseMenu(() => openNegotiationEdit(neg))">
                                <Pencil class="w-4 h-4" />
                                Editar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else-if="activeTab === 'financeiro'" class="space-y-4">
                  <div class="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h3 class="text-base font-semibold mb-1">Plano de Pagamento</h3>
                      <p class="text-muted-foreground text-sm">
                        {{ planoPagamentoItems.length }} lançamento(s) no total
                      </p>
                    </div>

                    <div class="flex flex-wrap gap-3">
                      <div class="min-w-[240px]">
                        <label class="text-xs text-muted-foreground block mb-1">Filtrar por negociação</label>
                        <select v-model="selectedNegociacaoId"
                          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                          <option :value="null">Todas</option>
                          <option v-for="neg in imovel.negociacoes || []" :key="neg.id" :value="neg.id">
                            {{ neg.numero || '-' }}
                          </option>
                        </select>
                      </div>

                      <div class="min-w-[240px]">
                        <label class="text-xs text-muted-foreground block mb-1">Filtrar por item</label>
                        <select v-model="selectedItemPagamentoFinanceiroId"
                          class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                          <option :value="null">Todos</option>
                          <option v-for="item in itemPagamentoOptions" :key="item.id" :value="item.id">
                            {{ item.label }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div v-if="!planoPagamentoFilteredItems.length"
                    class="text-muted-foreground text-sm py-6 text-center border border-border rounded-lg bg-muted/10">
                    Nenhum plano de pagamento encontrado para o filtro.
                  </div>

                  <div v-else class="space-y-3">
                    <div class="border border-border rounded-xl overflow-hidden">
                      <div
                        class="grid grid-cols-12 gap-2 bg-muted/20 px-3 py-2 text-xs font-semibold border-b border-border">
                        <div class="col-span-1">Ano</div>
                        <div class="col-span-1">Mês</div>
                        <div class="col-span-3">Item</div>
                        <div class="col-span-2">Por pagar</div>
                        <div class="col-span-2">Valor Pago</div>
                        <div class="col-span-2">Vencimento</div>
                        <div class="col-span-1">Estado</div>
                      </div>

                      <div v-for="item in planoPagamentoPaginated" :key="item.key"
                        class="grid grid-cols-12 gap-2 px-3 py-2 border-b border-border last:border-0 items-center">
                        <div class="col-span-1 text-sm font-medium">{{ item.ano ?? '-' }}</div>
                        <div class="col-span-1 text-sm font-medium">{{ item.mes ?? '-' }}</div>
                        <div class="col-span-3 text-sm truncate">{{ item.itemPagamentoLabel || '-' }}</div>
                        <div class="col-span-2 text-sm">{{ item.por_pagar || '0,00' }}</div>
                        <div class="col-span-2 text-sm">{{ item.valor_pago || '0,00' }}</div>
                        <div class="col-span-2 text-sm">{{ item.data_vencimento || '-' }}</div>
                        <div class="col-span-1">
                          <span class="px-2 py-1 text-xs rounded-full whitespace-nowrap"
                            :class="planoEstadoClass(item)">
                            {{ item.estado || '-' }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-3 px-1">
                      <div class="text-xs text-muted-foreground">
                        Mostrando
                        <span class="font-medium text-foreground">{{ planoPagamentoRangeStart }}</span>
                        –
                        <span class="font-medium text-foreground">{{ planoPagamentoRangeEnd }}</span>
                        de
                        <span class="font-medium text-foreground">{{ planoPagamentoFilteredItems.length }}</span>
                      </div>

                      <div class="flex items-center gap-2">
                        <label class="text-xs text-muted-foreground">Por página</label>
                        <select v-model.number="planoPagamentoPageSize"
                          class="px-2 py-1 rounded-md border border-input bg-background text-xs">
                          <option :value="10">10</option>
                          <option :value="20">20</option>
                          <option :value="50">50</option>
                          <option :value="100">100</option>
                          <option :value="200">200</option>
                        </select>

                        <button type="button"
                          class="px-3 py-1 rounded-md border border-border bg-background text-sm hover:bg-muted disabled:opacity-50"
                          :disabled="planoPagamentoPage <= 1" @click="planoPagamentoPage = planoPagamentoPage - 1">
                          Anterior
                        </button>

                        <div class="flex items-center gap-1">
                          <button v-for="page in planoPagamentoPagesToShow" :key="page" type="button"
                            class="px-3 py-1 rounded-md border text-sm hover:bg-muted"
                            :class="page === planoPagamentoPage ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-foreground'"
                            @click="planoPagamentoPage = page">
                            {{ page }}
                          </button>
                        </div>

                        <button type="button"
                          class="px-3 py-1 rounded-md border border-border bg-background text-sm hover:bg-muted disabled:opacity-50"
                          :disabled="planoPagamentoPage >= planoPagamentoTotalPages"
                          @click="planoPagamentoPage = planoPagamentoPage + 1">
                          Próxima
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

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

    <div v-else class="text-center py-20 text-muted-foreground">
      Imóvel não encontrado.
    </div>

    <div v-if="showCreateModal" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
      <div
        class="modal-surface w-full max-w-4xl border border-zinc-300 rounded-xl p-4 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-black/10"
        style="background-color: #ffffff !important; color: #000000 !important; opacity: 1 !important; mix-blend-mode: normal !important; backdrop-filter: none !important;">
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
                  ??
                  '-' }}
                </option>
              </select>
            </div>

            <div class="md:col-span-3 border border-border rounded-md p-3 bg-muted/5 space-y-3">
              <div class="flex items-center justify-between gap-2">
                <div>
                  <label class="text-sm font-semibold">Itens da negociação *</label>
                  <p class="text-xs text-muted-foreground">O item Imóvel (IM) é obrigatório. Pode adicionar mais itens
                    com
                    valor, prestações, periodicidade e desconto próprios.</p>
                </div>
                <button type="button"
                  class="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
                  :disabled="!availableItemsFor(createNegotiationItems, -1).length"
                  @click="addNegotiationItem(createNegotiationItems)">
                  + Adicionar item
                </button>
              </div>

              <div v-if="!createNegotiationItems.length"
                class="text-xs text-muted-foreground border border-dashed border-border rounded-md py-4 text-center">
                A carregar itens...
              </div>

              <div v-for="(row, idx) in createNegotiationItems" :key="row._key"
                class="border border-border rounded-md p-3 space-y-2 bg-background"
                :class="row._locked ? 'ring-1 ring-primary/30' : ''">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs text-muted-foreground">
                    Item #{{ idx + 1 }}<span v-if="row._locked"> · Obrigatório</span>
                  </span>
                  <button v-if="!row._locked" type="button" class="text-xs text-red-600 hover:underline"
                    @click="removeNegotiationItem(createNegotiationItems, idx)">
                    Remover
                  </button>
                </div>

                <div>
                  <label class="text-xs text-muted-foreground block mb-1">Item *</label>
                  <div v-if="row._locked" class="px-3 py-2 rounded-md border border-input bg-muted text-sm font-medium">
                    {{ itemRowLabel(row) }}
                  </div>
                  <select v-else v-model="row.item_id" required
                    class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                    <option value="">Selecione</option>
                    <option v-for="opt in availableItemsFor(createNegotiationItems, idx)" :key="opt.id" :value="opt.id">
                      {{ itemLabel(opt) }}
                    </option>
                  </select>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-12 gap-2">
                  <div class="md:col-span-2">
                    <label class="text-xs text-muted-foreground block mb-1">Valor *</label>
                    <input :value="row.valor" type="text" inputmode="decimal" required
                      class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm"
                      @keydown="handleMoneyKeydown" @input="handleItemMoneyInput(row, 'valor', $event)" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-xs text-muted-foreground block mb-1">Desconto</label>
                    <input :value="row.desconto" type="text" inputmode="decimal"
                      class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm"
                      @keydown="handleMoneyKeydown" @input="handleItemMoneyInput(row, 'desconto', $event)" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-xs text-muted-foreground block mb-1">Nº Prest. *</label>
                    <input v-model="row.num_prestacoes" type="number" min="1" required
                      class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-xs text-muted-foreground block mb-1">Periodicidade *</label>
                    <select v-model="row.periodicidade" required
                      class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm">
                      <option value="">-</option>
                      <option value="M">Mensal</option>
                      <option value="B">Bimensal</option>
                      <option value="T">Trimestral</option>
                      <option value="Q">Quadrimestral</option>
                      <option value="S">Semestral</option>
                      <option value="A">Anual</option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-xs text-muted-foreground block mb-1">Prestação *</label>
                    <input :value="row.prestacao" type="text" inputmode="decimal" required
                      class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm"
                      @keydown="handleMoneyKeydown" @input="handleItemMoneyInput(row, 'prestacao', $event)" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-xs text-muted-foreground block mb-1">Down Payment</label>
                    <input :value="row.down_payment" type="text" inputmode="decimal"
                      class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm"
                      @keydown="handleMoneyKeydown" @input="handleItemMoneyInput(row, 'down_payment', $event)" />
                  </div>
                </div>
              </div>

              <p v-if="createNegotiationItems.length" class="text-xs text-muted-foreground">
                Total venda (soma de Valor − Desconto):
                <span class="font-medium text-foreground">{{
                  converteParaMonetario(computeNegotiationTotal(createNegotiationItems)) }}</span>
              </p>
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Modelo de entrega *</label>
              <select v-model="createForm.modelo_entrega_id" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm">
                <option :value="null">Selecione</option>
                <option v-for="m in modeloEntregas" :key="m.id" :value="m.id">
                  {{ m.codigo ? `${m.codigo} - ${m.nome}` : m.nome }}
                </option>
              </select>
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Data contrato *</label>
              <div class="negociacao-datepicker-shell" data-vdt-mode="light">
                <DatePicker v-model="createForm.data_contrato" locale="en-US" mode="light" theme="neutral" />
              </div>
            </div>

            <div>
              <label class="text-xs text-muted-foreground block mb-1">Data entrega</label>
              <div class="negociacao-datepicker-shell" data-vdt-mode="light">
                <DatePicker v-model="createForm.data_entrega" locale="en-US" mode="light" theme="neutral" />
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3">
            <p v-if="createError" class="text-sm text-red-600">{{ createError }}</p>
            <span v-else class="text-sm text-muted-foreground"></span>

            <div class="flex items-center gap-2">
              <button type="button" class="px-4 py-2 rounded-md bg-muted text-foreground hover:bg-muted/70 text-sm"
                @click="showCreateModal = false" :disabled="createLoading">
                Cancelar
              </button>

              <button type="submit"
                class="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 text-sm font-medium"
                :disabled="createLoading">
                <span v-if="createLoading">A guardar...</span>
                <span v-else>Guardar</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showDetailsModal && selectedNegotiation"
      class="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
      <div
        class="modal-surface w-full max-w-2xl border border-zinc-300 rounded-xl p-4 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-black/10"
        style="background-color: #ffffff !important; color: #000000 !important; opacity: 1 !important; mix-blend-mode: normal !important; backdrop-filter: none !important;">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold">Detalhes da negociação</h3>
          <button type="button" class="px-3 py-2 rounded-md bg-muted text-foreground hover:bg-muted/70 text-sm"
            @click="showDetailsModal = false">
            Fechar
          </button>
        </div>

        <div class="space-y-3">
          <details class="rounded-lg border border-border p-3 bg-muted/10" open>
            <summary class="cursor-pointer select-none font-semibold text-sm">Identificação & Totais</summary>

            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Nº</p>
                <p class="font-medium">{{ selectedNegotiation.numero || '-' }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Estado</p>
                <p class="font-medium">{{ estadoLabel(selectedNegotiation.estado) }}</p>
              </div>

              <div class="rounded-lg border border-border p-3 md:col-span-2">
                <p class="text-xs text-muted-foreground mb-1">Titular</p>
                <p class="font-medium">
                  {{ getTitularInfo(selectedNegotiation).nome || '-' }}
                  <span v-if="getTitularInfo(selectedNegotiation).numEntidade"
                    class="text-muted-foreground font-normal">
                    · Nº {{ getTitularInfo(selectedNegotiation).numEntidade }}
                  </span>
                </p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Total venda</p>
                <p class="font-medium">{{ converteParaMonetario(selectedNegotiationTotais.totalVenda) }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Total desconto</p>
                <p class="font-medium">{{ converteParaMonetario(selectedNegotiationTotais.totalDesconto) }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Downpayment</p>
                <p class="font-medium">{{ converteParaMonetario(selectedNegotiation.downpayment ?? 0) }}</p>
              </div>

              <div class="rounded-lg border border-border p-3">
                <p class="text-xs text-muted-foreground mb-1">Saldo acumulado</p>
                <p class="font-medium">{{ converteParaMonetario(selectedNegotiation.saldo_acumulado ?? 0) }}</p>
              </div>
            </div>
          </details>

          <details class="rounded-lg border border-border p-3 bg-muted/10" open>
            <summary class="cursor-pointer select-none font-semibold text-sm">
              Itens ({{ negotiationItemsFromRecord(selectedNegotiation).length }})
            </summary>

            <div class="mt-3 space-y-2">
              <div v-if="!negotiationItemsFromRecord(selectedNegotiation).length"
                class="text-xs text-muted-foreground border border-dashed border-border rounded-md py-3 text-center">
                Sem itens registados.
              </div>

              <div v-for="(row, idx) in negotiationItemsFromRecord(selectedNegotiation)" :key="row._key"
                class="rounded-lg border border-border p-3 bg-background">
                <div class="flex items-center justify-between gap-2 mb-2">
                  <span class="text-xs text-muted-foreground">Item #{{ idx + 1 }}</span>
                  <span class="text-xs font-medium">{{ itemRowLabel(row) }}</span>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div>
                    <p class="text-muted-foreground">Valor</p>
                    <p class="font-medium">{{ row.valor || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Desconto</p>
                    <p class="font-medium">{{ row.desconto || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Nº Prest.</p>
                    <p class="font-medium">{{ row.num_prestacoes ?? '-' }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Periodicidade</p>
                    <p class="font-medium">{{ row.periodicidade || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Prestação</p>
                    <p class="font-medium">{{ row.prestacao || '-' }}</p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Saldo acumulado</p>
                    <p class="font-medium text-emerald-700 dark:text-emerald-300">{{ row.saldo_acumulado || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </details>

          <details class="rounded-lg border border-border p-3 bg-muted/10">
            <summary class="cursor-pointer select-none font-semibold text-sm">Datas & Status</summary>

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

    <div v-if="showEditModal && selectedNegotiation"
      class="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
      <div
        class="modal-surface w-full max-w-4xl border border-zinc-300 rounded-xl p-4 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-black/10"
        style="background-color: #ffffff !important; color: #000000 !important; opacity: 1 !important; mix-blend-mode: normal !important; backdrop-filter: none !important;">
        <div class="flex items-center justify-between gap-3">
          <h3 class="text-base font-semibold">Editar negociação</h3>
        </div>

        <div v-if="editIsLocked"
          class="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Esta negociação está {{ estadoLabel(selectedNegotiation?.estado).toLowerCase() }}. Só é possível editar Nº
          Contrato, Estado e Data de entrega.
        </div>

        <form class="space-y-3" @submit.prevent="updateNegotiation">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="text-xs text-foreground block mb-1">Nº Contrato</label>
              <input v-model="editForm.numero" type="text"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm" />
            </div>

            <div>
              <label class="text-xs text-foreground block mb-1">Estado</label>
              <select v-model="editForm.estado"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm">
                <option value="">Selecione</option>
                <option value="RA">Rascunho</option>
                <option value="RE">Reservado</option>
                <option value="CO">Concluído</option>
                <option value="CA">Cancelado</option>
              </select>
            </div>

            <div>
              <label class="text-xs text-foreground block mb-1">Papel</label>
              <select v-model="editForm.papel" :disabled="editIsLocked"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                required>
                <option value="TI">TI - Titular</option>
              </select>
            </div>

            <div class="md:col-span-3">
              <label class="text-xs text-foreground block mb-1">Entidade (filtrar)</label>

              <input v-model="entidadeSearch" type="text" :disabled="editIsLocked"
                placeholder="Filtrar pelo Nº Entidade, Nº BI, NIF ou Nome..."
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring mb-2 disabled:opacity-60 disabled:cursor-not-allowed" />

              <select v-model="editForm.entidade_id" :disabled="editIsLocked"
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                required>
                <option :value="null">Selecione</option>
                <option v-for="e in filteredEntidades" :key="e.id" :value="e.id">
                  {{ e.nome ?? '-' }} · {{ e.num_entidade ?? '-' }} · BI: {{ e.num_bi ?? '-' }} · NIF: {{ e.nif ?? e.NIF
                  ??
                  '-' }}
                </option>
              </select>
            </div>

            <div class="md:col-span-3 border border-border rounded-md p-3 bg-muted/5 space-y-3">
              <div class="flex items-center justify-between gap-2">
                <div>
                  <label class="text-sm font-semibold">Itens da negociação *</label>
                  <p class="text-xs text-muted-foreground">O item Imóvel (IM) é obrigatório. Pode adicionar mais itens
                    com
                    valor, prestações, periodicidade e desconto próprios.</p>
                </div>
                <button type="button"
                  class="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="editIsLocked || !availableItemsFor(editNegotiationItems, -1).length"
                  @click="addNegotiationItem(editNegotiationItems)">
                  + Adicionar item
                </button>
              </div>

              <div v-if="!editNegotiationItems.length"
                class="text-xs text-muted-foreground border border-dashed border-border rounded-md py-4 text-center">
                A carregar itens...
              </div>

              <div v-for="(row, idx) in editNegotiationItems" :key="row._key"
                class="border border-border rounded-md p-3 space-y-2 bg-background"
                :class="row._locked ? 'ring-1 ring-primary/30' : ''">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs text-muted-foreground">
                    Item #{{ idx + 1 }}<span v-if="row._locked"> · Obrigatório</span>
                  </span>
                  <button v-if="!row._locked" type="button"
                    class="text-xs text-red-600 hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
                    :disabled="editIsLocked" @click="removeNegotiationItem(editNegotiationItems, idx)">
                    Remover
                  </button>
                </div>

                <div>
                  <label class="text-xs text-muted-foreground block mb-1">Item *</label>
                  <div v-if="row._locked" class="px-3 py-2 rounded-md border border-input bg-muted text-sm font-medium">
                    {{ itemRowLabel(row) }}
                  </div>
                  <select v-else v-model="row.item_id" :disabled="editIsLocked" required
                    class="w-full px-3 py-2 rounded-md border border-input bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                    <option value="">Selecione</option>
                    <option v-for="opt in availableItemsFor(editNegotiationItems, idx)" :key="opt.id" :value="opt.id">
                      {{ itemLabel(opt) }}
                    </option>
                  </select>
                </div>

                <div class="grid grid-cols-2 md:grid-cols-12 gap-2">
                  <div class="md:col-span-2">
                    <label class="text-xs text-muted-foreground block mb-1">Valor *</label>
                    <input :value="row.valor" type="text" inputmode="decimal" required :disabled="editIsLocked"
                      class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      @keydown="handleMoneyKeydown" @input="handleItemMoneyInput(row, 'valor', $event)" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-xs text-muted-foreground block mb-1">Desconto</label>
                    <input :value="row.desconto" type="text" inputmode="decimal" :disabled="editIsLocked"
                      class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      @keydown="handleMoneyKeydown" @input="handleItemMoneyInput(row, 'desconto', $event)" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-xs text-muted-foreground block mb-1">Nº Prest. *</label>
                    <input v-model="row.num_prestacoes" type="number" min="1" required :disabled="editIsLocked"
                      class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-xs text-muted-foreground block mb-1">Periodicidade *</label>
                    <select v-model="row.periodicidade" required :disabled="editIsLocked"
                      class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                      <option value="">-</option>
                      <option value="M">M - Mensal</option>
                      <option value="T">T - Trimestral</option>
                      <option value="B">B - Bimestral</option>
                      <option value="S">S - Semestral</option>
                      <option value="A">A - Anual</option>
                    </select>
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-xs text-muted-foreground block mb-1">Prestação *</label>
                    <input :value="row.prestacao" type="text" inputmode="decimal" required :disabled="editIsLocked"
                      class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      @keydown="handleMoneyKeydown" @input="handleItemMoneyInput(row, 'prestacao', $event)" />
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-xs text-muted-foreground block mb-1">Down Payment</label>
                    <input :value="row.down_payment" type="text" inputmode="decimal" :disabled="editIsLocked"
                      class="w-full px-2 py-1.5 rounded-md border border-input bg-background text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      @keydown="handleMoneyKeydown" @input="handleItemMoneyInput(row, 'down_payment', $event)" />
                  </div>
                </div>
              </div>

              <p v-if="editNegotiationItems.length" class="text-xs text-muted-foreground">
                Total venda (soma de Valor − Desconto):
                <span class="font-medium text-foreground">{{
                  converteParaMonetario(computeNegotiationTotal(editNegotiationItems)) }}</span>
              </p>
            </div>

            <div>
              <label class="text-xs text-foreground block mb-1">Modelo de entrega *</label>
              <select v-model="editForm.modelo_entrega_id" :disabled="editIsLocked" required
                class="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                <option :value="null">Selecione</option>
                <option v-for="m in modeloEntregas" :key="m.id" :value="m.id">
                  {{ m.codigo ? `${m.codigo} - ${m.nome}` : m.nome }}
                </option>
              </select>
            </div>

            <div>
              <label class="text-xs text-foreground block mb-1">Data contrato *</label>
              <div class="negociacao-datepicker-shell" data-vdt-mode="light"
                :class="editIsLocked ? 'opacity-60 pointer-events-none' : ''">
                <DatePicker v-model="editForm.data_contrato" :disabled="editIsLocked" locale="en-US" mode="light"
                  theme="neutral" />
              </div>
            </div>

            <div>
              <label class="text-xs text-foreground block mb-1">Data entrega</label>
              <div class="negociacao-datepicker-shell" data-vdt-mode="light">
                <DatePicker v-model="editForm.data_entrega" locale="en-US" mode="light" theme="neutral" />
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3">
            <p v-if="editError" class="text-sm text-red-600">{{ editError }}</p>
            <span v-else class="text-sm text-muted-foreground"></span>

            <div class="flex items-center gap-2">
              <button type="button" class="px-4 py-2 rounded-md bg-muted text-foreground hover:bg-muted/70 text-sm"
                @click="showEditModal = false" :disabled="editLoading">
                Cancelar
              </button>

              <button type="submit"
                class="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 text-sm font-medium"
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
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { DatePicker } from '@tiaohsun/vue-datepicker'
import '@tiaohsun/vue-datepicker/style'
import { Ban, CheckCircle2, ChevronDown, Clock3, FileText, Info, Handshake, Banknote, Files, History, Loader2, MoreHorizontal, Pencil, User } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import http from '@/api/http'
import relatorioService from '@/services/relatorioService'
import { converteParaMonetario, formataEntradaNumerica } from '@/utils/formatacao'
import { useApiErrorHandler } from '@/composables/useApiErrorHandler'

const { handleApiError } = useApiErrorHandler()

const route = useRoute()

const moedas = ref([])
const entidades = ref([])
const items = ref([])
const modeloEntregas = ref([])
const entidadeSearch = ref('')

const createNegotiationItems = ref([])
const editNegotiationItems = ref([])

const filteredEntidades = computed(() => {
  const q = (entidadeSearch.value || '').trim().toLowerCase()
  const list = entidades.value

  const selectedId =
    (showEditModal.value && editForm.value?.entidade_id) ||
    (showCreateModal.value && createForm.value?.entidade_id) ||
    null

  if (!q) return list

  const matches = list.filter((e) => {
    const numEnt = String(e.num_entidade ?? e.numEntidade ?? '').toLowerCase()
    const numBi = String(e.num_bi ?? '').toLowerCase()
    const nif = String(e.nif ?? e.NIF ?? '').toLowerCase()
    const nome = String(e.nome ?? '').toLowerCase()
    return numEnt.includes(q) || numBi.includes(q) || nif.includes(q) || nome.includes(q)
  })

  if (selectedId && !matches.some((e) => String(e.id) === String(selectedId))) {
    const selected = list.find((e) => String(e.id) === String(selectedId))
    if (selected) matches.unshift(selected)
  }

  return matches
})

const papeis = ref([
  { value: 'VE', label: 'VE - Vendedor' },
  { value: 'CO', label: 'CO - Comprador' },
  { value: 'FI', label: 'FI - Fiador' },
  { value: 'TI', label: 'TI - Titular' },
  { value: 'PR', label: 'PR - Procurador' },
  { value: 'TE', label: 'TE - Testemunha' }
])

const imovel = ref(null)
const loading = ref(false)

const tabs = ref([
  { value: 'resumo', label: 'Resumo', icon: Info },
  { value: 'negociacoes', label: 'Negociações', icon: Handshake },
  { value: 'financeiro', label: 'Financeiro', icon: Banknote },
  { value: 'documentos', label: 'Documentos', icon: Files },
  { value: 'historico', label: 'Histórico', icon: History }
])

const activeTab = ref('resumo')

const activeTabLabel = computed(() => tabs.value.find((t) => t.value === activeTab.value)?.label || '-')

const selectedItemPagamentoFinanceiroId = ref(null)
const selectedNegociacaoId = ref(null)

const aoaMoedaId = computed(() => {
  const aoa = moedas.value.find((m) => {
    const sigla = String(m?.sigla ?? m?.codigo ?? m?.nome ?? '').trim().toUpperCase()
    return sigla === 'AOA' || sigla.includes('KWANZA')
  })
  return aoa?.id ?? null
})

const imItem = computed(() => {
  const list = items.value || []

  const byCode = list.find((i) => {
    const codes = [i?.codigo, i?.sigla, i?.code, i?.abreviatura]
      .map((c) => String(c ?? '').trim().toUpperCase())
    return codes.includes('IM')
  })
  if (byCode) return byCode

  const byName = list.find((i) => {
    const nome = String(i?.nome ?? i?.descricao ?? i?.label ?? '').trim().toLowerCase()
    return nome === 'imóvel' || nome === 'imovel' || nome.startsWith('imóvel') || nome.startsWith('imovel')
  })
  return byName || null
})

function normalizeNegotiationPayload(form, imovelId, rows = []) {
  const itens = rows.map((r) => ({
    item_id: r.item_id,
    item: r.item_id,
    valor: parseMoneyValue(r.valor),
    desconto: parseMoneyValue(r.desconto),
    num_prestacoes: r.num_prestacoes != null && r.num_prestacoes !== '' ? Number(r.num_prestacoes) : null,
    periodicidade: r.periodicidade || null,
    prestacao: parseMoneyValue(r.prestacao),
    down_payment: parseMoneyValue(r.down_payment)
  }))

  const totalDownPayment = itens.reduce((acc, it) => acc + (it.down_payment || 0), 0)

  return {
    imovel: imovelId,
    numero: form.numero,
    estado: form.estado,
    moeda: aoaMoedaId.value,
    modelo_entrega: form.modelo_entrega_id,
    valor_venda: computeNegotiationTotal(rows),
    downpayment: totalDownPayment,
    data_contrato: form.data_contrato || null,
    data_entrega: form.data_entrega || null,
    observacao: form.observacao,
    activo: form.activo,
    entidade: form.entidade_id,
    papel: form.papel,
    itens
  }
}

const allowedMoneyKeys = [
  'Backspace',
  'Delete',
  'Tab',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
  'Enter'
]

const planoPagamentoItems = computed(() => {
  const negociacoes = Array.isArray(imovel.value?.negociacoes) ? imovel.value.negociacoes : []

  return negociacoes.flatMap((neg) => {
    const plano = Array.isArray(neg?.planoPagamento) ? neg.planoPagamento : []

    return plano.map((p, idx) => {
      const negociacaoItem = p?.negociacaoItem ?? p?.negociacao_item ?? null
      const item = negociacaoItem?.item ?? p?.itemPagamento ?? p?.item_pagamento ?? p?.item ?? null

      return {
        key: `${neg?.id ?? 'neg'}-${p?.ano ?? ''}-${p?.mes ?? ''}-${idx}`,
        negociacao_id: neg?.id ?? null,
        negociacao_numero: neg?.numero ?? null,
        itemPagamentoId: item?.id ?? p?.item_pagamento_id ?? p?.item_id ?? null,
        itemPagamentoLabel: item?.nome ?? item?.descricao ?? item?.codigo ?? item?.label ?? null,
        ano: p?.ano ?? null,
        mes: p?.mes ?? null,
        valor_pago: p?.valor_pago ?? null,
        por_pagar: p?.por_pagar ?? null,
        data_vencimento: p?.data_vencimento ?? null,
        estado: p?.estado ?? null,
        situacao: p?.situacao ?? null
      }
    })
  })
})

const itemPagamentoOptions = computed(() => {
  const seen = new Map()

  planoPagamentoItems.value.forEach((item) => {
    if (item.itemPagamentoId == null) return

    const id = String(item.itemPagamentoId)
    if (seen.has(id)) return

    seen.set(id, {
      id: item.itemPagamentoId,
      label: item.itemPagamentoLabel || `Item ${item.itemPagamentoId}`
    })
  })

  return Array.from(seen.values())
})

const negociacoesFiltradas = computed(() => {
  return Array.isArray(imovel.value?.negociacoes) ? imovel.value.negociacoes : []
})

// Estados que bloqueiam a criação de nova negociação para o mesmo imóvel.
const ESTADOS_ACTIVOS = new Set(['RE', 'CO', 'AC'])
const hasNegociacaoActiva = computed(() =>
  negociacoesFiltradas.value.some((n) =>
    ESTADOS_ACTIVOS.has(String(n?.estado ?? '').toUpperCase())
  )
)

const negociacaoAtivaImovel = computed(() => {
  const negociacoes = Array.isArray(imovel.value?.negociacoes) ? imovel.value.negociacoes : []

  const ativaPorFlag = negociacoes.find((neg) => {
    const activo = neg?.activo
    return activo === true || activo === 1 || activo === '1'
  })

  if (ativaPorFlag) return ativaPorFlag

  const ativaPorEstado = negociacoes.find((neg) => ['RE', 'CO'].includes(String(neg?.estado ?? '').toUpperCase()))
  return ativaPorEstado || null
})

function getNegotiacaoProgressValue(negociacao) {
  // total_venda = soma do `valor` dos negociacaoItem (não vem pronto no registo,
  // por isso calculamos aqui a partir dos items).
  const totalVenda = getNegotiationTotals(negociacao).totalVenda
  const saldoAcumulado = parseMoneyValue(negociacao?.saldo_acumulado)

  if (!Number.isFinite(totalVenda) || totalVenda <= 0 || !Number.isFinite(saldoAcumulado)) {
    return 0
  }

  const percent = (saldoAcumulado / totalVenda) * 100
  return Math.max(0, Math.min(100, percent))
}

function formatProgressPercent(value) {
  return Number.isFinite(Number(value)) ? Number(value).toFixed(0) : '0'
}

function planoEstadoClass(item) {
  const estado = String(item?.estado ?? '').toLowerCase()
  const situacao = String(item?.situacao ?? '').toLowerCase()

  if (situacao === 'pago' || estado === 'pago' || estado === 'paga') {
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200'
  }
  if (estado.includes('vencid') || situacao.includes('vencid') || estado === 'em atraso' || estado === 'atrasado') {
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200'
  }
  return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-200'
}

function getNegotiacaoProgresso(negociacao) {
  return getNegotiacaoProgressValue(negociacao)
}

const planoPagamentoFilteredItems = computed(() => {
  let items = planoPagamentoItems.value

  if (selectedNegociacaoId.value) {
    items = items.filter((item) => item.negociacao_id === selectedNegociacaoId.value)
  }

  if (selectedItemPagamentoFinanceiroId.value) {
    const selectedId = String(selectedItemPagamentoFinanceiroId.value)
    items = items.filter((item) => item.itemPagamentoId != null && String(item.itemPagamentoId) === selectedId)
  }

  return items
})

const planoPagamentoPage = ref(1)
const planoPagamentoPageSize = ref(20)

const planoPagamentoTotalPages = computed(() => {
  const total = planoPagamentoFilteredItems.value.length
  return Math.max(1, Math.ceil(total / planoPagamentoPageSize.value))
})

const planoPagamentoPaginated = computed(() => {
  const start = (planoPagamentoPage.value - 1) * planoPagamentoPageSize.value
  return planoPagamentoFilteredItems.value.slice(start, start + planoPagamentoPageSize.value)
})

const planoPagamentoRangeStart = computed(() => {
  if (!planoPagamentoFilteredItems.value.length) return 0
  return (planoPagamentoPage.value - 1) * planoPagamentoPageSize.value + 1
})

const planoPagamentoRangeEnd = computed(() => {
  return Math.min(
    planoPagamentoPage.value * planoPagamentoPageSize.value,
    planoPagamentoFilteredItems.value.length
  )
})

const planoPagamentoPagesToShow = computed(() => {
  const last = planoPagamentoTotalPages.value
  const current = planoPagamentoPage.value
  const start = Math.max(1, current - 2)
  const end = Math.min(last, current + 2)
  const pages = []
  for (let p = start; p <= end; p++) pages.push(p)
  return pages
})

watch([selectedNegociacaoId, selectedItemPagamentoFinanceiroId, planoPagamentoPageSize], () => {
  planoPagamentoPage.value = 1
})

watch(planoPagamentoTotalPages, (total) => {
  if (planoPagamentoPage.value > total) {
    planoPagamentoPage.value = total
  }
})

const loadImovel = async (id) => {
  if (!id) return
  loading.value = true

  try {
    if (!moedas.value.length) {
      try {
        const resMoedas = await http.get('/api/moedas')
        const dados = resMoedas?.data?.dados
        const list = Array.isArray(dados?.items) ? dados.items : (Array.isArray(dados) ? dados : [])
        moedas.value = list
      } catch (e) {
        console.error(e)
        moedas.value = []
      }
    }

    if (!entidades.value.length) {
      try {
        const resEnt = await http.get('/api/entidades')
        const dados = resEnt?.data?.dados
        const list = Array.isArray(dados?.items) ? dados.items : (Array.isArray(dados) ? dados : [])
        entidades.value = list
      } catch (e) {
        console.error(e)
        entidades.value = []
      }
    }

    if (!items.value.length) {
      try {
        const resItems = await http.get('/api/items')
        const dados = resItems?.data?.dados
        const list = Array.isArray(dados?.items) ? dados.items : (Array.isArray(dados) ? dados : [])
        items.value = list
      } catch (e) {
        console.error(e)
        items.value = []
      }
    }

    if (!modeloEntregas.value.length) {
      try {
        const resMe = await http.get('/api/modelo-entregas', { params: { per_page: 1000 } })
        const dados = resMe?.data?.dados
        const list = Array.isArray(dados?.items) ? dados.items : (Array.isArray(dados) ? dados : [])
        modeloEntregas.value = list
      } catch (e) {
        console.error(e)
        modeloEntregas.value = []
      }
    }

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

const showCreateModal = ref(false)
const createLoading = ref(false)
const createError = ref('')

const createForm = ref({
  numero: '',
  estado: '',
  modelo_entrega_id: null,
  data_contrato: '',
  data_entrega: '',
  observacao: '',
  activo: true,
  entidade_id: null,
  papel: 'VE',
  imovel_id: null
})

function resetCreateForm() {
  createForm.value = {
    numero: '',
    estado: '',
    modelo_entrega_id: null,
    data_contrato: '',
    data_entrega: '',
    observacao: '',
    activo: true,
    entidade_id: null,
    papel: 'VE',
    imovel_id: imovel.value?.id ?? null
  }

  createNegotiationItems.value = imItem.value
    ? [{ ...emptyNegotiationItem(), item_id: imItem.value.id, _locked: true }]
    : []
}

watch(showCreateModal, (v) => {
  if (v) {
    resetCreateForm()
    createError.value = ''
  }
})

async function createNegotiation() {
  if (!imovel.value?.id) return

  const itemErr = validateNegotiationItems(createNegotiationItems.value)
  if (itemErr) {
    createError.value = itemErr
    toast.error(itemErr)
    return
  }

  if (!createForm.value.modelo_entrega_id) {
    createError.value = 'Seleccione o modelo de entrega.'
    toast.error(createError.value)
    return
  }

  createLoading.value = true
  createError.value = ''

  try {
    const payload = normalizeNegotiationPayload(createForm.value, imovel.value.id, createNegotiationItems.value)

    const res = await http.post('/api/negociacaos', payload)
    toast.success(res?.data?.message || 'Negociação criada com sucesso.')
    showCreateModal.value = false
    await loadImovel(imovel.value.id)
  } catch (e) {
    console.error(e)
    createError.value = handleApiError(e)
  } finally {
    createLoading.value = false
  }
}

const selectedNegotiation = ref(null)
const showDetailsModal = ref(false)
const showEditModal = ref(false)

const negociacaoPdfLoading = ref({})

const openActionsMenuId = ref(null)

function toggleActionsMenu(id) {
  openActionsMenuId.value = openActionsMenuId.value === id ? null : id
}

function runAndCloseMenu(fn) {
  openActionsMenuId.value = null
  if (typeof fn === 'function') fn()
}

function handleActionsMenuOutsideClick(event) {
  if (openActionsMenuId.value == null) return
  const selector = `.actions-menu-container[data-menu-id="${openActionsMenuId.value}"]`
  const container = document.querySelector(selector)
  if (container && !container.contains(event.target)) {
    openActionsMenuId.value = null
  }
}

onMounted(() => document.addEventListener('mousedown', handleActionsMenuOutsideClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleActionsMenuOutsideClick))

function isRascunho(neg) {
  return String(neg?.estado ?? '').toUpperCase() === 'RA'
}

// Negociação activa = Reservada, Concluída ou Activa (estados em que o
// contrato/conta-corrente/relatórios pós-acordo fazem sentido).
const ESTADOS_NEGOCIACAO_ACTIVA = new Set(['RE', 'CO', 'AC'])
function isNegociacaoActiva(neg) {
  return ESTADOS_NEGOCIACAO_ACTIVA.has(String(neg?.estado ?? '').toUpperCase())
}

function podeImprimirTermoQuitacao(neg) {
  return String(neg?.estado ?? '').toUpperCase() === 'AC'
}

async function gerarContratoPdf(neg) {
  if (!neg?.id) return
  const key = `${neg.id}-contrato`
  negociacaoPdfLoading.value[key] = true
  try {
    const response = await relatorioService.negociacaoContratoPdf(neg.id)
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (e) {
    console.error(e)
    let msg = 'Falha ao gerar o contrato.'
    if (e?.response?.data instanceof Blob && e.response.data.type === 'application/json') {
      try {
        const text = await e.response.data.text()
        msg = JSON.parse(text)?.message || msg
      } catch {}
    } else if (e?.response?.data?.message) {
      msg = e.response.data.message
    }
    toast.error(msg)
  } finally {
    negociacaoPdfLoading.value[key] = false
  }
}

async function gerarTermoQuitacaoPdf(neg) {
  if (!neg?.id) return
  const key = `${neg.id}-termo-quitacao`
  negociacaoPdfLoading.value[key] = true
  try {
    const response = await relatorioService.negociacaoTermoQuitacaoPdf(neg.id)
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (e) {
    console.error(e)
    let msg = 'Falha ao gerar o termo de quitação.'
    if (e?.response?.data instanceof Blob && e.response.data.type === 'application/json') {
      try {
        const text = await e.response.data.text()
        msg = JSON.parse(text)?.message || msg
      } catch {}
    } else if (e?.response?.data?.message) {
      msg = e.response.data.message
    }
    toast.error(msg)
  } finally {
    negociacaoPdfLoading.value[key] = false
  }
}

async function gerarExtratoPdf(neg, tipo) {
  if (!neg?.id) return
  const key = `${neg.id}-${tipo}`
  negociacaoPdfLoading.value[key] = true
  try {
    let fetch
    if (tipo === 'simulacao') {
      fetch = relatorioService.negociacaoSimulacaoPdf(neg.id)
    } else if (tipo === 'detalhado') {
      fetch = relatorioService.negociacaoExtratoDetalhadoPdf(neg.id)
    } else {
      fetch = relatorioService.negociacaoExtratoResumoPdf(neg.id)
    }
    const response = await fetch
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'noopener,noreferrer')
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (e) {
    console.error(e)
    const label = tipo === 'simulacao' ? 'a simulação' : `o extrato ${tipo}`
    let msg = `Falha ao gerar ${label}.`
    if (e?.response?.data instanceof Blob && e.response.data.type === 'application/json') {
      try {
        const text = await e.response.data.text()
        msg = JSON.parse(text)?.message || msg
      } catch {}
    } else if (e?.response?.data?.message) {
      msg = e.response.data.message
    }
    toast.error(msg)
  } finally {
    negociacaoPdfLoading.value[key] = false
  }
}

const editIsLocked = computed(() => {
  const estado = String(selectedNegotiation.value?.estado ?? '').toUpperCase()
  return estado === 'RE' || estado === 'CO'
})

function openCreateNegotiationModal() {
  selectedNegotiation.value = null
  showCreateModal.value = true
  showDetailsModal.value = false
  showEditModal.value = false
  entidadeSearch.value = ''
}

function openNegotiationDetails(neg) {
  selectedNegotiation.value = neg
  showCreateModal.value = false
  showDetailsModal.value = true
  showEditModal.value = false
}

const editLoading = ref(false)
const editError = ref('')

const editForm = ref({
  numero: '',
  estado: '',
  modelo_entrega_id: null,
  data_contrato: '',
  data_entrega: '',
  entidade_id: null,
  papel: 'TI'
})

function getPivotPrincipal(neg) {
  const candidates = [
    neg?.entidade_principal,
    neg?.entidadePrincipal,
    neg?.negociacao_entidades,
    neg?.negociacaoEntidades,
    neg?.entidades
  ]

  const isPrincipal = (entry) => {
    const flag = entry?.pivot?.principal ?? entry?.principal
    return flag === true || flag === 1 || String(flag) === '1'
  }

  for (const c of candidates) {
    if (!c) continue
    if (Array.isArray(c)) {
      if (!c.length) continue
      return c.find(isPrincipal) || c[0]
    }
    return c
  }

  return null
}

function resolveNegotiationEntidadeId(neg) {
  const entry = getPivotPrincipal(neg)
  if (!entry) return neg?.entidade_id ?? neg?.entidade?.id ?? null

  return (
    entry?.pivot?.entidade_id ??
    entry?.entidade_id ??
    entry?.entidade?.id ??
    entry?.id ??
    neg?.entidade_id ??
    neg?.entidade?.id ??
    null
  )
}

function resolveNegotiationPapel(neg) {
  const entry = getPivotPrincipal(neg)
  return entry?.pivot?.papel ?? entry?.papel ?? neg?.papel ?? 'TI'
}

function resolveModeloEntregaId(neg) {
  const candidates = [
    neg?.modeloEntrega,
    neg?.modelo_entrega,
    neg?.modelo_entrega_id,
    neg?.modeloEntregaId
  ]
  for (const c of candidates) {
    if (c == null || c === '') continue
    if (typeof c === 'object') {
      const id = c?.id ?? c?.value
      if (id != null && id !== '') return id
      continue
    }
    return c
  }
  return null
}

function getTitularInfo(neg) {
  const entry = getPivotPrincipal(neg)
  if (!entry) return { nome: null, numEntidade: null }
  return {
    nome: entry?.nome ?? entry?.entidade?.nome ?? entry?.razao_social ?? null,
    numEntidade: entry?.num_entidade ?? entry?.entidade?.num_entidade ?? entry?.numEntidade ?? null
  }
}

async function fetchFullNegociacao(neg) {
  if (!neg?.id) return neg
  try {
    const res = await http.get(`/api/negociacaos/${neg.id}`)
    return res?.data?.dados ?? neg
  } catch (e) {
    console.error(e)
    return neg
  }
}

function preencherEditForm(neg) {
  selectedNegotiation.value = neg
  entidadeSearch.value = ''
  editError.value = ''

  editForm.value = {
    numero: neg?.numero ?? '',
    estado: neg?.estado ?? '',
    modelo_entrega_id: resolveModeloEntregaId(neg),
    data_contrato: neg?.data_contrato ?? '',
    data_entrega: neg?.data_entrega ?? '',
    entidade_id: resolveNegotiationEntidadeId(neg),
    papel: resolveNegotiationPapel(neg)
  }

  const rows = negotiationItemsFromRecord(neg)
  if (imItem.value) {
    const imIdx = rows.findIndex((r) => String(r.item_id) === String(imItem.value.id))
    if (imIdx === -1) {
      rows.unshift({ ...emptyNegotiationItem(), item_id: imItem.value.id, _locked: true })
    } else {
      const [imRow] = rows.splice(imIdx, 1)
      imRow._locked = true
      rows.unshift(imRow)
    }
  }
  editNegotiationItems.value = rows
}

async function openNegotiationEdit(neg) {
  showCreateModal.value = false
  showDetailsModal.value = false
  showEditModal.value = true

  preencherEditForm(neg)

  editLoading.value = true
  try {
    const full = await fetchFullNegociacao(neg)
    if (showEditModal.value) preencherEditForm(full)
  } finally {
    editLoading.value = false
  }
}

function estadoLabel(estado) {
  const map = {
    RA: 'Rascunho',
    RE: 'Reservado',
    CO: 'Concluído',
    CA: 'Cancelado'
  }

  if (!estado) return '-'
  return map[estado] || estado
}

function negociacaoEstadoMeta(estado) {
  const map = {
    RA: { label: 'Rascunho', classes: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-200 dark:border-slate-700', icon: FileText },
    RE: { label: 'Reservado', classes: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-200 dark:border-amber-800', icon: Clock3 },
    CO: { label: 'Concluído', classes: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-200 dark:border-emerald-800', icon: CheckCircle2 },
    CA: { label: 'Cancelado', classes: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800', icon: Ban }
  }

  return map[estado] || {
    label: estado ? String(estado) : '-',
    classes: 'bg-muted text-muted-foreground border-border',
    icon: FileText
  }
}

function negociacaoEstadoCardClass(estado) {
  const map = {
    RA: 'bg-slate-50 dark:bg-slate-900/30',
    RE: 'bg-amber-50 dark:bg-amber-950/20',
    CO: 'bg-emerald-50 dark:bg-emerald-950/20',
    CA: 'bg-red-50 dark:bg-red-950/20'
  }

  return map[estado] || 'bg-card'
}

function getNegotiationItemLabels(neg) {
  const plano = Array.isArray(neg?.planoPagamento) ? neg.planoPagamento : []
  const labels = []

  plano.forEach((p) => {
    const itemPagamento = p?.itemPagamento ?? p?.item_pagamento ?? null
    const label = itemPagamento?.nome ?? itemPagamento?.descricao ?? itemPagamento?.codigo ?? itemPagamento?.label

    if (label && !labels.includes(label)) {
      labels.push(label)
    }
  })

  return labels
}

function handleMoneyKeydown(event) {
  if (allowedMoneyKeys.includes(event.key) || event.ctrlKey || event.metaKey) return

  if (!/[\d,]/.test(event.key)) {
    event.preventDefault()
  }
}

async function updateNegotiation() {
  if (!selectedNegotiation.value?.id) return

  const itemErr = validateNegotiationItems(editNegotiationItems.value)
  if (itemErr) {
    editError.value = itemErr
    toast.error(itemErr)
    return
  }

  if (!editForm.value.modelo_entrega_id) {
    editError.value = 'Seleccione o modelo de entrega.'
    toast.error(editError.value)
    return
  }

  editLoading.value = true
  editError.value = ''

  try {
    const payload = normalizeNegotiationPayload(editForm.value, imovel.value.id, editNegotiationItems.value)

    const res = await http.put(`/api/negociacaos/${selectedNegotiation.value.id}`, payload)
    toast.success(res?.data?.message || 'Negociação atualizada com sucesso.')
    showEditModal.value = false
    await loadImovel(imovel.value.id)
  } catch (e) {
    console.error(e)
    editError.value = handleApiError(e)
  } finally {
    editLoading.value = false
  }
}

function emptyNegotiationItem() {
  return {
    _key: `row-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`,
    item_id: '',
    valor: '',
    desconto: '',
    num_prestacoes: null,
    periodicidade: '',
    prestacao: '',
    down_payment: ''
  }
}

function addNegotiationItem(rows) {
  rows.push(emptyNegotiationItem())
}

function removeNegotiationItem(rows, idx) {
  rows.splice(idx, 1)
}

function availableItemsFor(rows, currentIdx) {
  const selectedIds = rows
    .map((r, i) => (i === currentIdx ? null : r.item_id))
    .filter((id) => id !== null && id !== undefined && id !== '')
    .map(String)

  return items.value.filter((opt) => !selectedIds.includes(String(opt.id)))
}

function itemLabel(opt) {
  return opt?.nome || opt?.descricao || opt?.codigo || opt?.label || `Item #${opt?.id ?? '-'}`
}

function handleItemMoneyInput(row, field, event) {
  const input = event.target
  const rawValue = String(input.value || '').replace(/[^\d,]/g, '')
  const formattedValue = formataEntradaNumerica(rawValue)
  input.value = formattedValue
  row[field] = formattedValue
}

function parseMoneyValue(value) {
  if (value == null || value === '') return 0
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const cleaned = String(value).replace(/\s/g, '').replace(',', '.')
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

function computeNegotiationTotal(rows) {
  return rows.reduce((acc, r) => acc + (parseMoneyValue(r.valor) - parseMoneyValue(r.desconto)), 0)
}

function validateNegotiationItems(rows) {
  if (!rows.length) return 'Adicione pelo menos um item à negociação.'

  if (imItem.value) {
    const hasIm = rows.some((r) => String(r.item_id) === String(imItem.value.id))
    if (!hasIm) return 'O item Imóvel (IM) é obrigatório em todas as negociações.'
  }

  const seen = new Set()
  for (const r of rows) {
    if (!r.item_id) return 'Selecione o item em todas as linhas.'
    const key = String(r.item_id)
    if (seen.has(key)) {
      return 'Não é permitido repetir o mesmo item na mesma negociação.'
    }
    seen.add(key)
  }
  return null
}

function getNegotiationTotal(neg) {
  const rows = negotiationItemsFromRecord(neg)
  if (rows.length) return computeNegotiationTotal(rows)
  return parseMoneyValue(neg?.valor_venda)
}

function getNegotiationTotals(neg) {
  const rows = negotiationItemsFromRecord(neg)
  if (rows.length) {
    return {
      totalVenda: rows.reduce((acc, r) => acc + parseMoneyValue(r.valor), 0),
      totalDesconto: rows.reduce((acc, r) => acc + parseMoneyValue(r.desconto), 0)
    }
  }
  return {
    totalVenda: parseMoneyValue(neg?.valor_venda),
    totalDesconto: parseMoneyValue(neg?.desconto)
  }
}

const negociacaoAtivaItens = computed(() => negotiationItemsFromRecord(negociacaoAtivaImovel.value))
const negociacaoAtivaTotais = computed(() => getNegotiationTotals(negociacaoAtivaImovel.value))
const selectedNegotiationTotais = computed(() => getNegotiationTotals(selectedNegotiation.value))
const titularAtivo = computed(() => getTitularInfo(negociacaoAtivaImovel.value))

function negotiationItemsFromRecord(neg) {
  if (!neg) return []

  const itemLookup = {}
  const plano = Array.isArray(neg?.planoPagamento) ? neg.planoPagamento : []
  plano.forEach((p) => {
    const ni = p?.negociacaoItem ?? p?.negociacao_item ?? null
    if (ni?.id != null && ni?.item) {
      itemLookup[String(ni.id)] = ni.item
    }
  })

  const source =
    neg?.itens ??
    neg?.negociacaoItens ??
    neg?.negociacao_itens ??
    neg?.negociacaoItems ??
    neg?.negociacao_items ??
    []

  if (!Array.isArray(source) || !source.length) return []

  return source.map((it) => {
    const resolvedItem = it.item ?? itemLookup[String(it.id)] ?? null
    return {
      _key: `row-${it.id ?? Math.random().toString(36).slice(2, 10)}-${Date.now()}`,
      item_id: it.item_id ?? it.item?.id ?? resolvedItem?.id ?? '',
      item: resolvedItem,
      valor: it.valor != null && it.valor !== '' ? formataEntradaNumerica(it.valor) : '',
      desconto: it.desconto != null && it.desconto !== '' ? formataEntradaNumerica(it.desconto) : '',
      num_prestacoes: it.num_prestacoes ?? null,
      periodicidade: it.periodicidade ?? '',
      prestacao: it.prestacao != null && it.prestacao !== '' ? formataEntradaNumerica(it.prestacao) : '',
      down_payment: it.down_payment != null && it.down_payment !== '' ? formataEntradaNumerica(it.down_payment) : '',
      saldo_acumulado: it.saldo_acumulado != null && it.saldo_acumulado !== '' ? formataEntradaNumerica(it.saldo_acumulado) : ''
    }
  })
}

function itemRowLabel(row) {
  if (row?.item) return itemLabel(row.item)
  const opt = items.value.find((o) => String(o.id) === String(row?.item_id))
  if (opt) return itemLabel(opt)
  return `Item #${row?.item_id ?? '-'}`
}
</script>

<style scoped>
.modal-surface {
  color-scheme: light;
  color: #000;
}

.modal-surface :deep(*) {
  color: #000 !important;
}

.modal-surface :deep(.text-red-500),
.modal-surface :deep(.text-red-600),
.modal-surface :deep(.text-red-700),
.modal-surface :deep(.text-destructive) {
  color: #dc2626 !important;
}

.modal-surface :deep(.text-muted-foreground) {
  color: #000 !important;
}

.modal-surface :deep(label) {
  color: #000 !important;
}

.modal-surface :deep(.bg-card),
.modal-surface :deep(.bg-background),
.modal-surface :deep(.border),
.modal-surface :deep(.border-border) {
  background-color: #fff !important;
  border-color: #d1d5db !important;
}

.modal-surface :deep(input),
.modal-surface :deep(select),
.modal-surface :deep(textarea) {
  color: #000 !important;
  background-color: #fff !important;
  border-color: #d1d5db !important;
}

.modal-surface :deep(input::placeholder),
.modal-surface :deep(textarea::placeholder) {
  color: #6b7280 !important;
}

.negociacao-datepicker-shell {
  --color-vdt-surface: #f9fafb;
  --color-vdt-surface-secondary: #f3f4f6;
  --color-vdt-surface-elevated: #ffffff;
  --color-vdt-content: #000000;
  --color-vdt-content-secondary: #111827;
  --color-vdt-content-muted: #6b7280;
  --color-vdt-outline: #d1d5db;
  --color-vdt-interactive-hover: #e5e7eb;
  --color-vdt-interactive-active: #dbe1e7;
}

.negociacao-datepicker-shell :deep(.date-picker-container) {
  background-color: #f9fafb !important;
  color: #000 !important;
}

.negociacao-datepicker-shell :deep(*) {
  color: inherit;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
