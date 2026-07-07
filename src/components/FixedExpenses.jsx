import { Pencil, Trash2, Copy } from 'lucide-react'
import { formatCurrency, formatDateBR } from '../utils'

export default function FixedExpenses({ fixedExpenses, total, totalPaid, onTogglePaid, onEdit, onDelete, onCopyFromPrevMonth }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h2 className="text-sm font-semibold text-gray-800">Gastos fixos do mês</h2>
        <button
          onClick={onCopyFromPrevMonth}
          className="flex items-center gap-1 text-xs font-medium text-gray-600 border border-gray-300 rounded-lg px-2.5 py-1.5 hover:bg-gray-50"
        >
          <Copy size={13} /> Copiar do mês anterior
        </button>
      </div>

      {fixedExpenses.length === 0 ? (
        <p className="text-sm text-gray-400">Nenhum gasto fixo cadastrado neste mês.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {fixedExpenses.map(item => (
            <li key={item.id} className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                checked={item.status === 'pago'}
                onChange={() => onTogglePaid(item.id)}
                className="rounded border-gray-300 shrink-0 w-5 h-5"
                aria-label="Marcar como pago"
              />
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium truncate ${item.status === 'pago' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                  {item.name}
                </p>
                <p className="text-[11px] text-gray-400">{item.category} · vence {formatDateBR(item.date)}</p>
              </div>
              <span className={`text-sm font-medium shrink-0 ${item.status === 'pago' ? 'text-gray-400' : 'text-gray-800'}`}>
                {formatCurrency(item.value)}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${
                  item.status === 'pago' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}
              >
                {item.status === 'pago' ? 'Pago' : 'Não pago'}
              </span>
              <div className="flex items-center gap-0.5 shrink-0">
                <button onClick={() => onEdit(item)} className="tap-target text-gray-400 hover:text-gray-700" aria-label="Editar">
                  <Pencil size={15} />
                </button>
                <button onClick={() => onDelete(item.id)} className="tap-target text-gray-400 hover:text-red-600" aria-label="Excluir">
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-sm">
        <span className="text-gray-500">Total fixo: <span className="font-semibold text-gray-800">{formatCurrency(total)}</span></span>
        <span className="text-gray-500">Pago: <span className="font-semibold text-emerald-600">{formatCurrency(totalPaid)}</span></span>
      </div>
    </div>
  )
}
