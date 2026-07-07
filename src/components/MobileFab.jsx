import { useState } from 'react'
import { Plus, TrendingUp, TrendingDown, X } from 'lucide-react'

export default function MobileFab({ onAddIncome, onAddExpense }) {
  const [open, setOpen] = useState(false)

  function handleChoice(fn) {
    setOpen(false)
    fn()
  }

  return (
    <div className="sm:hidden fixed right-4 z-40" style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}>
      {open && (
        <div className="flex flex-col items-end gap-2 mb-3">
          <button
            onClick={() => handleChoice(onAddIncome)}
            className="flex items-center gap-2 bg-white text-emerald-700 border border-emerald-200 shadow-lg rounded-full pl-4 pr-3 py-2.5 text-sm font-medium tap-target"
          >
            Receita <TrendingUp size={16} />
          </button>
          <button
            onClick={() => handleChoice(onAddExpense)}
            className="flex items-center gap-2 bg-white text-red-700 border border-red-200 shadow-lg rounded-full pl-4 pr-3 py-2.5 text-sm font-medium tap-target"
          >
            Gasto <TrendingDown size={16} />
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen(v => !v)}
        className={`tap-target rounded-full shadow-lg text-white transition-transform ${
          open ? 'bg-gray-700 rotate-45' : 'bg-gray-900'
        }`}
        style={{ width: 56, height: 56 }}
        aria-label={open ? 'Fechar' : 'Adicionar lançamento'}
      >
        {open ? <X size={22} /> : <Plus size={24} />}
      </button>
    </div>
  )
}
