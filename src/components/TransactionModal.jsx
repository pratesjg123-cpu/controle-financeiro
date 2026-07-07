import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS, STATUS_OPTIONS } from '../constants'
import { todayISO } from '../utils'

const emptyForm = (type) => ({
  type,
  name: '',
  value: '',
  date: todayISO(),
  category: type === 'receita' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
  paymentMethod: PAYMENT_METHODS[0],
  status: type === 'receita' ? 'pago' : 'pendente',
  note: '',
  isFixed: false,
})

export default function TransactionModal({ type, initialData, onClose, onSave }) {
  const [form, setForm] = useState(initialData ? { ...initialData } : emptyForm(type))

  useEffect(() => {
    setForm(initialData ? { ...initialData } : emptyForm(type))
  }, [initialData, type])

  const isExpense = form.type === 'despesa'
  const categories = isExpense ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  function handleChange(field, val) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.value) return
    onSave({
      ...form,
      value: parseFloat(String(form.value).replace(',', '.')) || 0,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="bg-white w-full sm:max-w-md sm:rounded-xl rounded-t-2xl max-h-[92vh] overflow-y-auto"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-sm font-semibold text-gray-800">
            {initialData ? 'Editar' : 'Novo'} {isExpense ? 'gasto' : 'lançamento de receita'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Nome / Descrição</label>
            <input
              autoFocus
              type="text"
              required
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder={isExpense ? 'Ex: Supermercado' : 'Ex: Salário'}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-600">Valor (R$)</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                required
                value={form.value}
                onChange={e => handleChange('value', e.target.value)}
                placeholder="0,00"
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Data</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={e => handleChange('date', e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Categoria</label>
            <select
              value={form.category}
              onChange={e => handleChange('category', e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {isExpense && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Forma de pagamento</label>
                  <select
                    value={form.paymentMethod}
                    onChange={e => handleChange('paymentMethod', e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  >
                    {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Status</label>
                  <select
                    value={form.status}
                    onChange={e => handleChange('status', e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white capitalize focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Observação (opcional)</label>
                <input
                  type="text"
                  value={form.note}
                  onChange={e => handleChange('note', e.target.value)}
                  placeholder="Ex: parcela 3/10"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 pt-1">
                <input
                  type="checkbox"
                  checked={form.isFixed}
                  onChange={e => handleChange('isFixed', e.target.checked)}
                  className="rounded border-gray-300"
                />
                Este é um gasto fixo mensal
              </label>
            </>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`flex-1 rounded-lg py-2 text-sm font-medium text-white ${
                isExpense ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
