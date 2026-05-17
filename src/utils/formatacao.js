/**
 * Formatação de números/valores para exibição no frontend.
 * Equivalente ao comportamento do PHP (converteParaMonetario / converteParaReal).
 */

export function converteParaReal(parametro) {
  const valor = typeof parametro === 'string' ? parametro : (parametro ?? '').toString()
  const limpo = valor.trim().replaceAll(' ', '')

  if (limpo === '' || !Number.isFinite(Number(String(limpo).replace(',', '.')))) {
    return 0.0
  }

  return Number(String(limpo).replace(',', '.'))
}

export function converteParaMonetario(numero, casasDecimais = 2) {
  const valorReal = converteParaReal(numero)

  const decimais = Number.isFinite(Number(casasDecimais)) ? Number(casasDecimais) : 2
  const casas = Number.isInteger(decimais) ? decimais : 2

  // PHP number_format($valor, $casas_decimais, ',', ' ')
  const partes = Math.abs(valorReal).toFixed(casas).split('.')
  const inteiro = partes[0]
  const frac = partes[1] ?? ''

  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  const sinal = valorReal < 0 ? '-' : ''

  return `${sinal}${inteiroFormatado},${frac}`
}
