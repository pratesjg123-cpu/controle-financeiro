import { ChevronLeft, ChevronRight, Plus, Wallet } from 'lucide-react'
import { formatMonthLabel } from '../utils'

export default function Header({ monthKey, onPrevMonth, onNextMonth, onAddIncome, onAddExpense }) {
  return (
    <header
      className="bg-white border-b border-gray-200 sticky top-0 z-20"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
            <Wallet size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-tight">Controle Financeiro Pessoal</h1>
            <p className="text-xs text-gray-500 leading-tight">Organize suas finanças mês a mês</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-1 py-1">
            <button
              onClick={onPrevMonth}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition"
              aria-label="Mês anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-2 text-sm font-medium text-gray-800 min-w-[130px] text-center capitalize">
              {formatMonthLabel(monthKey)}
            </span>
            <button
              onClick={onNextMonth}
              className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600 transition"
              aria-label="Próximo mês"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onAddIncome}
              className="flex items-center gap-1 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition tap-target"
            >
              <Plus size={16} /> Receita
            </button>
            <button
              onClick={onAddExpense}
              className="flex items-center gap-1 text-sm font-medium bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition tap-target"
            >
              <Plus size={16} /> Gasto
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
