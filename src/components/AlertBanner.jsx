import { AlertTriangle } from 'lucide-react'

export default function AlertBanner({ percentCommitted, totalIncome }) {
  if (!totalIncome || totalIncome <= 0) return null
  if (percentCommitted < 80) return null

  const isOver100 = percentCommitted >= 100

  return (
    <div
      className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${
        isOver100
          ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-amber-50 border-amber-200 text-amber-800'
      }`}
    >
      <AlertTriangle size={18} className="shrink-0 mt-0.5" />
      <div>
        <p className="font-medium">
          {isOver100
            ? `Seus gastos já ultrapassaram sua renda do mês (${percentCommitted.toFixed(0)}%).`
            : `Atenção: ${percentCommitted.toFixed(0)}% da sua renda já está comprometida este mês.`}
        </p>
        <p className="opacity-80">Revise seus gastos por categoria para manter o mês no controle.</p>
      </div>
    </div>
  )
}
