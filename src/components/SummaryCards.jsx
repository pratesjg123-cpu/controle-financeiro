import { TrendingUp, TrendingDown, Wallet, Home, PartyPopper, PiggyBank } from 'lucide-react'
import { formatCurrency } from '../utils'

function Card({ icon: Icon, label, value, colorClass, sub }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-1 min-w-0">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <Icon size={16} className={colorClass} />
      </div>
      <span className={`text-lg font-semibold truncate ${colorClass}`}>{formatCurrency(value)}</span>
      {sub && <span className="text-[11px] text-gray-400">{sub}</span>}
    </div>
  )
}

export default function SummaryCards({ totals }) {
  const {
    totalIncome, totalExpense, balance, fixedTotal, leisureTotal, reservedTotal,
  } = totals

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      <Card icon={TrendingUp} label="Receita do mês" value={totalIncome} colorClass="text-emerald-600" />
      <Card icon={TrendingDown} label="Despesas do mês" value={totalExpense} colorClass="text-red-600" />
      <Card
        icon={Wallet}
        label="Saldo atual"
        value={balance}
        colorClass={balance >= 0 ? 'text-emerald-600' : 'text-red-600'}
      />
      <Card icon={Home} label="Gastos fixos" value={fixedTotal} colorClass="text-slate-600" />
      <Card icon={PartyPopper} label="Lazer" value={leisureTotal} colorClass="text-purple-600" />
      <Card icon={PiggyBank} label="Reservado" value={reservedTotal} colorClass="text-cyan-600" />
    </div>
  )
}
