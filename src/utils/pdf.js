// Helpers para PDFs devolvidos como Blob pelo backend.

export function blobToPdfUrl(data) {
  return URL.createObjectURL(new Blob([data], { type: 'application/pdf' }))
}

export function openPdf(data) {
  const url = blobToPdfUrl(data)
  window.open(url, '_blank', 'noopener,noreferrer')
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export function downloadPdf(data, fileName) {
  const url = blobToPdfUrl(data)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Quando o backend devolve um JSON de erro apesar de responseType:'blob',
// o axios entrega-o como Blob dentro do error. Esta função tenta extrair
// a mensagem para mostrar ao utilizador.
export async function extractBlobErrorMessage(error, fallback = 'Falha ao gerar o relatório.') {
  const data = error?.response?.data
  if (data instanceof Blob && data.type === 'application/json') {
    try {
      const text = await data.text()
      const parsed = JSON.parse(text)
      return parsed?.message || fallback
    } catch {
      return fallback
    }
  }
  return error?.response?.data?.message || fallback
}

export function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
