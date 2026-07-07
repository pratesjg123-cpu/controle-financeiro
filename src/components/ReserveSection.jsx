import { useState } from 'react'
import { PiggyBank } from 'lucide-react'
import { formatCurrency } from '../utils'

export default function ReserveSection({ reserveGoal, reservedTotal, onSetGoal }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(reserveGoal || '')

  const remaining = Math.max(reserveGoal - reservedTotal, 0)
  const percent = reserveGoal > 0 ? Math.min(100, (reservedTotal / reserveGoal) * 100) : 0

  function confirm() {
    onSetGoal(parseFloat(String(draft).replace(',', '.')) || 0)
    setEditing(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <PiggyBank size={16} className="text-cyan-600" />
        <h2 className="text-sm font-semibold text-gray-800">Reserva financeira do mês</h2>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>Meta do mês</span>
        {editing ? (
          <input
            autoFocus
            type="number"
            inputMode="decimal"
            step="0.01"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={confirm}
            onKeyDown={e => e.key === 'Enter' && confirm()}
            className="w-28 border border-gray-300 rounded px-1.5 py-0.5 text-xs text-right"
          />
        ) : (
          <button onClick={() => { setDraft(reserveGoal || ''); setEditing(true) }} className="font-medium text-gray-700 underline decoration-dotted">
            {formatCurrency(reserveGoal)}
          </button>
        )}
      </div>

      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div className="h-full bg-cyan-500 rounded-full transition-all" style={{ width: `${percent}%` }} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[11px] text-gray-400">Reservado</p>
          <p className="text-sm font-semibold text-emerald-600">{formatCurrency(reservedTotal)}</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-400">Falta</p>
          <p className="text-sm font-semibold text-amber-600">{formatCurrency(remaining)}</p>
        </div>
        <div>
          <p className="text-[11px] text-gray-400">Concluído</p>
          <p className="text-sm font-semibold text-cyan-600">{percent.toFixed(0)}%</p>
        </div>
      </div>
      <p className="text-[11px] text-gray-400 mt-2">
        Considera todos os lançamentos de despesa nas categorias "Reserva" e "Investimentos".
      </p>
    </div>
  )
}
