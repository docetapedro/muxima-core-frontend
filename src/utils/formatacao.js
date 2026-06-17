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

export function limparEntradaNumerica(parametro) {
  if (parametro == null) return ''
  return String(parametro).trim().replaceAll(/\s/g, '')
}

function separarEntradaNumerica(parametro) {
  if (parametro == null || parametro === '') return { inteiro: '', decimal: '' }

  const textoBruto = String(parametro)
  const textoLimpo = limparEntradaNumerica(textoBruto).replace(/[^\d.,]/g, '')

  if (textoLimpo === '') return { inteiro: '', decimal: '' }

  const valorNormalizado = textoLimpo.includes('.') && !textoLimpo.includes(',')
    ? textoLimpo.replace('.', ',')
    : textoLimpo

  const partes = valorNormalizado.split(',')
  const inteiro = (partes[0] ?? '').replace(/\D/g, '')
  const decimal = (partes[1] ?? '').replace(/\D/g, '').slice(0, 3)

  return { inteiro, decimal }
}

export function formataEntradaNumerica(parametro) {
  const { inteiro, decimal } = separarEntradaNumerica(parametro)

  if (inteiro === '' && decimal === '') return ''

  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

  if (decimal === '') {
    return inteiroFormatado
  }

  return `${inteiroFormatado},${decimal}`
}

export function parseEntradaNumerica(parametro) {
  const texto = limparEntradaNumerica(parametro).replace(/[^\d,]/g, '')

  if (texto === '') return null

  const partes = texto.split(',')
  const inteiro = (partes[0] ?? '').replace(/\D/g, '')
  const decimal = (partes[1] ?? '').replace(/\D/g, '')

  const valor = decimal ? `${inteiro || '0'}.${decimal}` : (inteiro || '0')
  const numero = Number(valor)

  return Number.isFinite(numero) ? numero : null
}

export function normalizaValorMonetarioEntrada(parametro) {
  if (parametro == null) return ''
  return String(parametro).replaceAll(/\s/g, '')
}

export function formataValorMonetarioEntrada(parametro, casasDecimais = 2) {
  const valor = normalizaValorMonetarioEntrada(parametro)

  if (valor === '') return ''

  const numero = converteParaReal(valor)
  const casas = Number.isInteger(Number(casasDecimais)) ? Number(casasDecimais) : 2

  const partes = Math.abs(numero).toFixed(casas).split('.')
  const inteiro = partes[0]
  const frac = partes[1] ?? ''

  const inteiroFormatado = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  const sinal = numero < 0 ? '-' : ''

  return `${sinal}${inteiroFormatado},${frac}`
}

export function parseValorMonetarioEntrada(parametro) {
  const valor = typeof parametro === 'string' ? parametro : (parametro ?? '').toString()
  const limpo = valor.replaceAll(' ', '').trim()

  if (limpo === '') return null

  const numero = Number(limpo.replace(',', '.'))

  return Number.isFinite(numero) ? numero : null
}
