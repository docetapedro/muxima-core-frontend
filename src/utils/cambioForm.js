export function emptyCambio() {
    return {
        data_cambio: null,
        cambio_usd: '',
        cambio_eur: ''
    }
}

export function cambioFromRecord(cambio) {
    return {
        id: cambio.id,
        data_cambio: cambio.data_cambio ?? null,
        cambio_usd: cambio.cambio_usd ?? null,
        cambio_eur: cambio.cambio_eur ?? null,
    }
}
