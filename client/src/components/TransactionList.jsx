"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight, ArrowDownRight, Trash2, Filter, Search, Download, PlusCircle, Edit2 } from "lucide-react"

const TransactionList = ({ transactions, onDelete, loading }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")

  if (loading) {
    return <div className="spinner"></div>
  }

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "food", label: "Food & Dining" },
    { value: "transportation", label: "Transportation" },
    { value: "entertainment", label: "Entertainment" },
    { value: "shopping", label: "Shopping" },
    { value: "utilities", label: "Utilities" },
    { value: "housing", label: "Housing" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "salary", label: "Salary" },
    { value: "investment", label: "Investment" },
    { value: "gift", label: "Gift" },
    { value: "other", label: "Other" },
  ]

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    // Filter by search term
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())

    // Filter by type
    const matchesType = filterType === "all" || transaction.type === filterType

    // Filter by category
    const matchesCategory = filterCategory === "all" || transaction.category === filterCategory

    return matchesSearch && matchesType && matchesCategory
  })

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "date") {
      return sortOrder === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    } else if (sortBy === "amount") {
      return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
    } else {
      return sortOrder === "asc"
        ? a.description.localeCompare(b.description)
        : b.description.localeCompare(a.description)
    }
  })

  // Group transactions by date
  const groupedTransactions = sortedTransactions.reduce((groups, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(transaction)
    return groups
  }, {})

  // Calculate totals
  const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Link to="/add-transaction" className="btn btn-primary">
          <PlusCircle size={18} />
          Add Transaction
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="card p-4">
          <h3 className="text-sm text-secondary mb-1">Total Income</h3>
          <p className="text-xl font-bold text-success">
            {totalIncome.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
          </p>
        </div>

        <div className="card p-4">
          <h3 className="text-sm text-secondary mb-1">Total Expenses</h3>
          <p className="text-xl font-bold text-danger">
            {totalExpenses.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
          </p>
        </div>

        <div className="card p-4">
          <h3 className="text-sm text-secondary mb-1">Balance</h3>
          <p className="text-xl font-bold">
            {(totalIncome - totalExpenses).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="form-select">
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="form-select">
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <button className="btn btn-outline">
              <Filter size={18} />
              <span className="hidden md:inline">More Filters</span>
            </button>

            <button className="btn btn-outline">
              <Download size={18} />
              <span className="hidden md:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="card">
        {sortedTransactions.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-lg mb-4">No transactions found</p>
            <Link to="/add-transaction" className="btn btn-primary">
              <PlusCircle size={18} />
              Add Your First Transaction
            </Link>
          </div>
        ) : (
          <div>
            {/* Sort Controls */}
            <div className="flex justify-end p-4 border-b">
              <div className="flex items-center gap-2">
                <span className="text-sm text-secondary">Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-select text-sm py-1">
                  <option value="date">Date</option>
                  <option value="amount">Amount</option>
                  <option value="description">Description</option>
                </select>

                <button
                  className="btn btn-outline text-sm py-1"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>
            </div>

            {/* Transactions by Date */}
            {Object.entries(groupedTransactions).map(([date, transactions]) => (
              <div key={date}>
                <div className="p-3 bg-gray-50 border-b">
                  <p className="font-medium">{date}</p>
                </div>

                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border-b hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-full p-2 ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}
                      >
                        {transaction.type === "income" ? (
                          <ArrowUpRight size={20} color="var(--success)" />
                        ) : (
                          <ArrowDownRight size={20} color="var(--danger)" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-secondary">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === "income" ? "text-success" : "text-danger"}`}>
                          {transaction.type === "income" ? "+" : "-"}
                          {transaction.amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link to={`/edit-transaction/${transaction.id}`} className="btn btn-outline text-sm p-2">
                          <Edit2 size={16} color="var(--primary)" />
                        </Link>
                        <button className="btn btn-outline text-sm p-2" onClick={() => onDelete(transaction.id)}>
                          <Trash2 size={16} color="var(--danger)" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionList
