import { ArrowUpRight, ArrowDownRight } from "lucide-react"

const Balance = ({ transactions }) => {
  // Calculate total income
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0)

  // Calculate total expenses
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0)

  // Calculate balance
  const balance = income - expenses

  return (
    <div className="grid gap-4">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Current Balance</h2>
        <div className="text-center p-6">
          <p className="text-4xl font-bold mb-2">
            {balance.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
          </p>
          <p className="text-secondary">Updated just now</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight size={20} color="var(--success)" />
            <h3 className="font-bold">Income</h3>
          </div>
          <p className="text-2xl font-bold text-success">
            {income.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight size={20} color="var(--danger)" />
            <h3 className="font-bold">Expenses</h3>
          </div>
          <p className="text-2xl font-bold text-danger">
            {expenses.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Balance
