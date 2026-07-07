export function formatCurrency(value) {
  const n = Number(value) || 0
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDateBR(isoDate) {
  if (!isoDate) return '-'
  const [y, m, d] = isoDate.split('-')
  if (!y || !m || !d) return isoDate
  return `${d}/${m}/${y}`
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export function getCurrentMonthKey() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function formatMonthLabel(monthKey) {
  const [y, m] = monthKey.split('-').map(Number)
  return `${MONTH_NAMES[m - 1]} de ${y}`
}

export function shiftMonth(monthKey, delta) {
  let [y, m] = monthKey.split('-').map(Number)
  m += delta
  while (m > 12) { m -= 12; y += 1 }
  while (m < 1) { m += 12; y -= 1 }
  return `${y}-${String(m).padStart(2, '0')}`
}

export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function emptyMonth() {
  return {
    transactions: [],
    reserveGoal: 0,
    categoryLimits: {},
  }
}

export function todayISO() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function exportMonthToCSV(monthKey, transactions) {
  const header = ['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor', 'Forma de pagamento', 'Status', 'Fixo', 'Observação']
  const rows = transactions.map(t => [
    formatDateBR(t.date),
    t.type === 'receita' ? 'Receita' : 'Despesa',
    t.name,
    t.category,
    String(t.value).replace('.', ','),
    t.paymentMethod || '',
    t.status || '',
    t.isFixed ? 'Sim' : 'Não',
    (t.note || '').replace(/[\r\n;]+/g, ' '),
  ])

  const csvLines = [header, ...rows].map(row =>
    row.map(field => {
      const str = String(field ?? '')
      // Escapa campos que contenham ; " ou quebras de linha
      if (/[;"\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`
      }
      return str
    }).join(';')
  )

  const csvContent = '\uFEFF' + csvLines.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `controle-financeiro-${monthKey}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
