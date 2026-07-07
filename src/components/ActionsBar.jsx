import { Download, RotateCcw, Copy } from 'lucide-react'

export default function ActionsBar({ onExportCSV, onClearMonth, onDuplicateToNextMonth }) {
  return (
    <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-2">
      <button
        onClick={onExportCSV}
        className="tap-target flex items-center justify-center gap-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2.5 sm:py-2 hover:bg-gray-50"
      >
        <Download size={14} /> Exportar CSV
      </button>
      <button
        onClick={onDuplicateToNextMonth}
        className="tap-target flex items-center justify-center gap-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg px-3 py-2.5 sm:py-2 hover:bg-gray-50"
      >
        <Copy size={14} /> Duplicar fixos para o próximo mês
      </button>
      <button
        onClick={onClearMonth}
        className="tap-target flex items-center justify-center gap-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-lg px-3 py-2.5 sm:py-2 hover:bg-red-50"
      >
        <RotateCcw size={14} /> Limpar mês atual
      </button>
    </div>
  )
}
