import { Pencil, Trash2 } from 'lucide-react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, STATUS_OPTIONS } from '../constants'
import { formatCurrency, formatDateBR } from '../utils'

const ALL_CATEGORIES = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])]

const statusStyles = {
  pago: 'bg-emerald-100 text-emerald-700',
  pendente: 'bg-amber-100 text-amber-700',
  reservado: 'bg-cyan-100 text-cyan-700',
}

export default function TransactionsTable({ transactions, filters, onFilterChange, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">Todos os lançamentos</h2>
        <div className="flex flex-wrap gap-2">
          <select
            value={filters.type}
            onChange={e => onFilterChange('type', e.target.value)}
            className="flex-1 min-w-[110px] sm:flex-none text-xs border border-gray-300 rounded-lg px-2 py-2 sm:py-1.5 bg-white"
          >
            <option value="todos">Todos os tipos</option>
            <option value="receita">Receitas</option>
            <option value="despesa">Despesas</option>
          </select>

          <select
            value={filters.category}
            onChange={e => onFilterChange('category', e.target.value)}
            className="flex-1 min-w-[110px] sm:flex-none text-xs border border-gray-300 rounded-lg px-2 py-2 sm:py-1.5 bg-white"
          >
            <option value="todas">Todas as categorias</option>
            {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            value={filters.status}
            onChange={e => onFilterChange('status', e.target.value)}
            className="flex-1 min-w-[110px] sm:flex-none text-xs border border-gray-300 rounded-lg px-2 py-2 sm:py-1.5 bg-white capitalize"
          >
            <option value="todos">Todos os status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>
      </div>

      {/* Mobile (abaixo de md): lista em cards, mais fácil de ler e tocar no celular */}
      <div className="md:hidden divide-y divide-gray-100">
        {transactions.map(t => (
          <div key={t.id} className="px-4 py-3 flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${t.type === 'receita' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {t.type === 'receita' ? 'Receita' : 'Despesa'}
                </span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[t.status] || 'bg-gray-100 text-gray-600'}`}>
                  {t.status}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-800 truncate">{t.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDateBR(t.date)} · {t.category}
                {t.paymentMethod ? ` · ${t.paymentMethod}` : ''}
              </p>
              <p className={`text-sm font-semibold mt-1 ${t.type === 'receita' ? 'text-emerald-600' : 'text-red-600'}`}>
                {t.type === 'receita' ? '+' : '-'} {formatCurrency(t.value)}
              </p>
            </div>
            <div className="flex flex-col items-center gap-0.5 shrink-0">
              <button onClick={() => onEdit(t)} className="tap-target text-gray-400 hover:text-gray-700" aria-label="Editar">
                <Pencil size={16} />
              </button>
              <button onClick={() => onDelete(t.id)} className="tap-target text-gray-400 hover:text-red-600" aria-label="Excluir">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Telas médias/grandes: tabela completa estilo planilha */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <th className="text-left font-medium px-4 py-2">Data</th>
              <th className="text-left font-medium px-4 py-2">Tipo</th>
              <th className="text-left font-medium px-4 py-2">Descrição</th>
              <th className="text-left font-medium px-4 py-2">Categoria</th>
              <th className="text-right font-medium px-4 py-2">Valor</th>
              <th className="text-left font-medium px-4 py-2">Pagamento</th>
              <th className="text-left font-medium px-4 py-2">Status</th>
              <th className="text-right font-medium px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-gray-600">{formatDateBR(t.date)}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.type === 'receita' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {t.type === 'receita' ? 'Receita' : 'Despesa'}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-800 max-w-[180px] truncate" title={t.name}>{t.name}</td>
                <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{t.category}</td>
                <td className={`px-4 py-2 text-right font-medium whitespace-nowrap ${t.type === 'receita' ? 'text-emerald-600' : 'text-red-600'}`}>
                  {t.type === 'receita' ? '+' : '-'} {formatCurrency(t.value)}
                </td>
                <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{t.paymentMethod || '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[t.status] || 'bg-gray-100 text-gray-600'}`}>
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onEdit(t)} className="p-1 text-gray-400 hover:text-gray-700">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => onDelete(t.id)} className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-8">Nenhum lançamento encontrado com os filtros atuais.</p>
      )}
    </div>
  )
}
