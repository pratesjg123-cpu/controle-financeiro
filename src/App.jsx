import { useState, useEffect, useMemo } from 'react'
import Header from './components/Header'
import AlertBanner from './components/AlertBanner'
import SummaryCards from './components/SummaryCards'
import CategoryBreakdown from './components/CategoryBreakdown'
import FixedExpenses from './components/FixedExpenses'
import ReserveSection from './components/ReserveSection'
import TransactionsTable from './components/TransactionsTable'
import TransactionModal from './components/TransactionModal'
import ActionsBar from './components/ActionsBar'
import MobileFab from './components/MobileFab'
import { loadData, saveData } from './storage'
import { getCurrentMonthKey, shiftMonth, emptyMonth, generateId, exportMonthToCSV } from './utils'
import { EXPENSE_CATEGORIES } from './constants'

export default function App() {
  const [data, setData] = useState(() => loadData())
  const [monthKey, setMonthKey] = useState(getCurrentMonthKey())
  const [modal, setModal] = useState(null) // { type: 'receita'|'despesa', editing: transaction|null }
  const [filters, setFilters] = useState({ type: 'todos', category: 'todas', status: 'todos' })

  useEffect(() => {
    saveData(data)
  }, [data])

  const monthData = data.months[monthKey] || emptyMonth()

  function updateMonth(key, updater) {
    setData(prev => {
      const current = prev.months[key] || emptyMonth()
      const updated = updater(current)
      return { ...prev, months: { ...prev.months, [key]: updated } }
    })
  }

  // ---------- Cálculos derivados ----------
  const totals = useMemo(() => {
    const transactions = monthData.transactions || []
    let totalIncome = 0
    let totalExpense = 0
    const byCategory = {}
    let fixedTotal = 0
    let fixedPaid = 0
    let reservedTotal = 0

    for (const t of transactions) {
      if (t.type === 'receita') {
        totalIncome += t.value
      } else {
        totalExpense += t.value
        byCategory[t.category] = (byCategory[t.category] || 0) + t.value
        if (t.isFixed) {
          fixedTotal += t.value
          if (t.status === 'pago') fixedPaid += t.value
        }
        if (t.category === 'Reserva' || t.category === 'Investimentos') {
          reservedTotal += t.value
        }
      }
    }

    const balance = totalIncome - totalExpense
    const leisureTotal = byCategory['Lazer'] || 0
    const percentCommitted = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0

    return {
      totalIncome, totalExpense, balance, byCategory,
      fixedTotal, fixedPaid, leisureTotal, reservedTotal, percentCommitted,
    }
  }, [monthData.transactions])

  const fixedExpenses = useMemo(
    () => (monthData.transactions || []).filter(t => t.type === 'despesa' && t.isFixed)
      .sort((a, b) => a.date.localeCompare(b.date)),
    [monthData.transactions]
  )

  const filteredTransactions = useMemo(() => {
    return (monthData.transactions || [])
      .filter(t => filters.type === 'todos' || t.type === filters.type)
      .filter(t => filters.category === 'todas' || t.category === filters.category)
      .filter(t => filters.status === 'todos' || t.status === filters.status)
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [monthData.transactions, filters])

  // ---------- Ações ----------
  function openAddModal(type) {
    setModal({ type, editing: null })
  }

  function openEditModal(transaction) {
    setModal({ type: transaction.type, editing: transaction })
  }

  function closeModal() {
    setModal(null)
  }

  function saveTransaction(form) {
    updateMonth(monthKey, current => {
      const transactions = current.transactions || []
      if (form.id) {
        return { ...current, transactions: transactions.map(t => t.id === form.id ? form : t) }
      }
      const newTransaction = { ...form, id: generateId() }
      return { ...current, transactions: [...transactions, newTransaction] }
    })
    closeModal()
  }

  function deleteTransaction(id) {
    if (!window.confirm('Excluir este lançamento?')) return
    updateMonth(monthKey, current => ({
      ...current,
      transactions: (current.transactions || []).filter(t => t.id !== id),
    }))
  }

  function toggleFixedPaid(id) {
    updateMonth(monthKey, current => ({
      ...current,
      transactions: (current.transactions || []).map(t =>
        t.id === id ? { ...t, status: t.status === 'pago' ? 'pendente' : 'pago' } : t
      ),
    }))
  }

  function copyFixedFromPrevMonth() {
    const prevKey = shiftMonth(monthKey, -1)
    const prevMonth = data.months[prevKey]
    const prevFixed = (prevMonth?.transactions || []).filter(t => t.type === 'despesa' && t.isFixed)

    if (prevFixed.length === 0) {
      alert('Não há gastos fixos cadastrados no mês anterior.')
      return
    }

    updateMonth(monthKey, current => {
      const existingNames = new Set((current.transactions || []).filter(t => t.isFixed).map(t => t.name))
      const toAdd = prevFixed
        .filter(t => !existingNames.has(t.name))
        .map(t => ({ ...t, id: generateId(), status: 'pendente' }))
      return { ...current, transactions: [...(current.transactions || []), ...toAdd] }
    })
  }

  function duplicateFixedToNextMonth() {
    const nextKey = shiftMonth(monthKey, 1)
    const currentFixed = fixedExpenses

    if (currentFixed.length === 0) {
      alert('Não há gastos fixos neste mês para duplicar.')
      return
    }

    updateMonth(nextKey, next => {
      const existingNames = new Set((next.transactions || []).filter(t => t.isFixed).map(t => t.name))
      const toAdd = currentFixed
        .filter(t => !existingNames.has(t.name))
        .map(t => ({ ...t, id: generateId(), status: 'pendente' }))
      return { ...next, transactions: [...(next.transactions || []), ...toAdd] }
    })
    alert(`Gastos fixos duplicados para ${nextKey}.`)
  }

  function clearMonth() {
    if (!window.confirm('Tem certeza que deseja limpar todos os lançamentos deste mês? Essa ação não pode ser desfeita.')) return
    updateMonth(monthKey, () => emptyMonth())
  }

  function setReserveGoal(value) {
    updateMonth(monthKey, current => ({ ...current, reserveGoal: value }))
  }

  function setCategoryLimit(category, value) {
    updateMonth(monthKey, current => ({
      ...current,
      categoryLimits: { ...current.categoryLimits, [category]: value },
    }))
  }

  function handleExportCSV() {
    exportMonthToCSV(monthKey, monthData.transactions || [])
  }

  function handleFilterChange(field, value) {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7] pb-24 sm:pb-10">
      <Header
        monthKey={monthKey}
        onPrevMonth={() => setMonthKey(shiftMonth(monthKey, -1))}
        onNextMonth={() => setMonthKey(shiftMonth(monthKey, 1))}
        onAddIncome={() => openAddModal('receita')}
        onAddExpense={() => openAddModal('despesa')}
      />

      <main className="max-w-7xl mx-auto px-4 py-5 space-y-5">
        <AlertBanner percentCommitted={totals.percentCommitted} totalIncome={totals.totalIncome} />

        <SummaryCards totals={totals} />

        <ActionsBar
          onExportCSV={handleExportCSV}
          onClearMonth={clearMonth}
          onDuplicateToNextMonth={duplicateFixedToNextMonth}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <FixedExpenses
              fixedExpenses={fixedExpenses}
              total={totals.fixedTotal}
              totalPaid={totals.fixedPaid}
              onTogglePaid={toggleFixedPaid}
              onEdit={openEditModal}
              onDelete={deleteTransaction}
              onCopyFromPrevMonth={copyFixedFromPrevMonth}
            />
            <TransactionsTable
              transactions={filteredTransactions}
              filters={filters}
              onFilterChange={handleFilterChange}
              onEdit={openEditModal}
              onDelete={deleteTransaction}
            />
          </div>

          <div className="space-y-5">
            <ReserveSection
              reserveGoal={monthData.reserveGoal || 0}
              reservedTotal={totals.reservedTotal}
              onSetGoal={setReserveGoal}
            />
            <CategoryBreakdown
              byCategory={totals.byCategory}
              totalExpense={totals.totalExpense}
              categoryLimits={monthData.categoryLimits || {}}
              onSetLimit={setCategoryLimit}
            />
          </div>
        </div>
      </main>

      <MobileFab
        onAddIncome={() => openAddModal('receita')}
        onAddExpense={() => openAddModal('despesa')}
      />

      {modal && (
        <TransactionModal
          type={modal.type}
          initialData={modal.editing}
          onClose={closeModal}
          onSave={saveTransaction}
        />
      )}
    </div>
  )
}
