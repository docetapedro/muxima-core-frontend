export function emptyMoeda() {
    return {
        sigla: null,
        nome: '',
        descricao: ''
    }
}

export function moedaFromRecord(moeda) {
    return {
        id: moeda.id,
        sigla: moeda.sigla ?? null,
        nome: moeda.nome ?? null,
        descricao: moeda.descricao ?? null
    }
}
