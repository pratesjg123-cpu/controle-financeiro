import { useState } from 'react'
import { EXPENSE_CATEGORIES, CATEGORY_COLORS } from '../constants'
import { formatCurrency } from '../utils'

export default function CategoryBreakdown({ byCategory, totalExpense, categoryLimits, onSetLimit }) {
  const [editingCategory, setEditingCategory] = useState(null)
  const [draftLimit, setDraftLimit] = useState('')

  function startEdit(cat) {
    setEditingCategory(cat)
    setDraftLimit(categoryLimits[cat] ? String(categoryLimits[cat]) : '')
  }

  function confirmEdit(cat) {
    const value = parseFloat(draftLimit.replace(',', '.')) || 0
    onSetLimit(cat, value)
    setEditingCategory(null)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-800">Gastos por categoria</h2>
        <span className="text-xs text-gray-400">Clique no limite para editar</span>
      </div>

      <div className="space-y-3">
        {EXPENSE_CATEGORIES.map(cat => {
          const spent = byCategory[cat] || 0
          if (spent === 0 && !categoryLimits[cat]) return null
          const limit = categoryLimits[cat] || 0
          const pctOfTotal = totalExpense > 0 ? (spent / totalExpense) * 100 : 0
          const pctOfLimit = limit > 0 ? (spent / limit) * 100 : 0
          const overLimit = limit > 0 && spent > limit

          return (
            <div key={cat}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-gray-700">{cat}</span>
                <div className="flex items-center gap-2">
                  <span className={overLimit ? 'text-red-600 font-medium' : 'text-gray-500'}>
                    {formatCurrency(spent)}
                  </span>
                  {editingCategory === cat ? (
                    <input
                      autoFocus
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      value={draftLimit}
                      onChange={e => setDraftLimit(e.target.value)}
                      onBlur={() => confirmEdit(cat)}
                      onKeyDown={e => e.key === 'Enter' && confirmEdit(cat)}
                      className="w-20 border border-gray-300 rounded px-1 py-0.5 text-xs"
                      placeholder="Limite"
                    />
                  ) : (
                    <button
                      onClick={() => startEdit(cat)}
                      className="text-gray-400 hover:text-gray-700 underline decoration-dotted"
                    >
                      {limit > 0 ? `limite ${formatCurrency(limit)}` : 'definir limite'}
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${overLimit ? 'bg-red-500' : CATEGORY_COLORS[cat] || 'bg-gray-400'}`}
                  style={{ width: `${Math.min(100, limit > 0 ? pctOfLimit : pctOfTotal)}%` }}
                />
              </div>
              {overLimit && (
                <p className="text-[11px] text-red-600 mt-0.5">Limite ultrapassado em {formatCurrency(spent - limit)}</p>
              )}
            </div>
          )
        })}
        {Object.values(byCategory).every(v => !v) && Object.keys(categoryLimits).length === 0 && (
          <p className="text-sm text-gray-400">Nenhum gasto lançado neste mês ainda.</p>
        )}
      </div>
    </div>
  )
}
