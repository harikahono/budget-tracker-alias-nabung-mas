"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  Wallet,
  Target,
  PlusCircle,
  Loader,
  PieChartIcon,
} from "lucide-react"
import { fetchBudgets, fetchGoals, fetchCategoryReports } from "../services/api"
import PieChart from "./PieChart"

const Dashboard = ({ transactions, loading }) => {
  const [budgets, setBudgets] = useState([])
  const [goals, setGoals] = useState([])
  // eslint-disable-next-line no-unused-vars
  const [categoryData, setCategoryData] = useState([])
  const [isLoadingBudgets, setIsLoadingBudgets] = useState(true)
  const [isLoadingGoals, setIsLoadingGoals] = useState(true)
  const [isLoadingReports, setIsLoadingReports] = useState(true)
  const [activeChartType, setActiveChartType] = useState("expense") // 'expense' or 'income'
  const [error, setError] = useState(null)

  // Fetch budgets
  useEffect(() => {
    const getBudgets = async () => {
      try {
        setIsLoadingBudgets(true)
        const data = await fetchBudgets()
        setBudgets(data)
      } catch (err) {
        console.error("Error fetching budgets:", err)
        setError("Failed to load budgets")
      } finally {
        setIsLoadingBudgets(false)
      }
    }

    getBudgets()
  }, [])

  // Fetch goals
  useEffect(() => {
    const getGoals = async () => {
      try {
        setIsLoadingGoals(true)
        const data = await fetchGoals()
        setGoals(data)
      } catch (err) {
        console.error("Error fetching goals:", err)
        setError("Failed to load goals")
      } finally {
        setIsLoadingGoals(false)
      }
    }

    getGoals()
  }, [])

  // Fetch category reports
  useEffect(() => {
    const getCategoryReports = async () => {
      try {
        setIsLoadingReports(true)
        const data = await fetchCategoryReports("month")
        setCategoryData(data)
      } catch (err) {
        console.error("Error fetching category reports:", err)
        setError("Failed to load category reports")
      } finally {
        setIsLoadingReports(false)
      }
    }

    getCategoryReports()
  }, [])

  // Calculate spent amounts for budgets based on transactions
  useEffect(() => {
    if (!transactions.length || !budgets.length) return

    // Create a map of category to total spent
    const categorySpent = {}
    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        const category = transaction.category
        if (!categorySpent[category]) {
          categorySpent[category] = 0
        }
        categorySpent[category] += transaction.amount
      }
    })

    // Update budgets with spent amounts
    const updatedBudgets = budgets.map((budget) => {
      const spent = categorySpent[budget.category] || 0
      return { ...budget, spent }
    })

    setBudgets(updatedBudgets)
  }, [transactions, budgets.length, budgets])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" size={32} />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    )
  }

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

  // Get recent transactions
  const recentTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  // Get top budget categories (limited to 4)
  const topBudgets = budgets.slice(0, 4).map((budget) => {
    const percentUsed = budget.amount > 0 ? ((budget.spent || 0) / budget.amount) * 100 : 0
    return {
      name: budget.name,
      spent: budget.spent || 0,
      budget: budget.amount,
      percentage: percentUsed,
    }
  })

  // Get top savings goals (limited to 3)
  const topGoals = goals.slice(0, 3).map((goal) => {
    const percentComplete = goal.target > 0 ? (goal.current / goal.target) * 100 : 0
    return {
      name: goal.name,
      current: goal.current,
      target: goal.target,
      percentage: percentComplete,
    }
  })

  // Prepare data for pie chart
  const prepareChartData = () => {
    // Filter transactions by type
    const filteredTransactions = transactions.filter((t) => t.type === activeChartType)

    // Group by category
    const categoryGroups = {}
    filteredTransactions.forEach((transaction) => {
      if (!categoryGroups[transaction.category]) {
        categoryGroups[transaction.category] = 0
      }
      categoryGroups[transaction.category] += transaction.amount
    })

    // Calculate total
    const total = Object.values(categoryGroups).reduce((sum, amount) => sum + amount, 0)

    // Format data for chart
    const chartData = Object.entries(categoryGroups).map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? (amount / total) * 100 : 0,
    }))

    // Sort by amount (descending)
    return chartData.sort((a, b) => b.amount - a.amount)
  }

  const chartData = prepareChartData()

  // Generate colors for pie chart segments
  const getChartColors = () => {
    const baseColors =
      activeChartType === "income"
        ? ["#48bb78", "#68d391", "#9ae6b4", "#c6f6d5", "#f0fff4"] // Green shades for income
        : ["#f56565", "#fc8181", "#feb2b2", "#fed7d7", "#fff5f5"] // Red shades for expenses

    // If we have more categories than colors, we'll cycle through the colors
    return chartData.map((_, index) => baseColors[index % baseColors.length])
  }

  const chartColors = getChartColors()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* Summary Cards */}
      <div className="grid">
        <div className="card">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg">Balance</h3>
            <DollarSign size={20} color="var(--primary)" />
          </div>
          <p className="text-3xl font-bold">
            {balance.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
          </p>
          <div className="flex items-center mt-2 text-sm">
            <Calendar size={14} />
            <span className="ml-1 text-secondary">Updated today</span>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg">Income</h3>
            <ArrowUpRight size={20} color="var(--success)" />
          </div>
          <p className="text-3xl font-bold text-success">
            {income.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
          </p>
          <div className="flex items-center mt-2 text-sm">
            <TrendingUp size={14} />
            <span className="ml-1 text-success">
              {transactions.length > 0 ? "Based on your transactions" : "Start tracking your income"}
            </span>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg">Expenses</h3>
            <ArrowDownRight size={20} color="var(--danger)" />
          </div>
          <p className="text-3xl font-bold text-danger">
            {expenses.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
          </p>
          <div className="flex items-center mt-2 text-sm">
            <TrendingUp size={14} />
            <span className="ml-1 text-danger">
              {transactions.length > 0 ? "Based on your transactions" : "Start tracking your expenses"}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Recent Transactions</h2>
          <Link to="/transactions" className="btn btn-outline text-sm">
            View All
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <p>No transactions yet. Add your first transaction!</p>
        ) : (
          <div>
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 border-b last:border-b-0">
                <div className="flex items-center gap-4">
                  <div className={`rounded-full p-2 ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
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
                <div className="text-right">
                  <p className={`font-bold ${transaction.type === "income" ? "text-success" : "text-danger"}`}>
                    {transaction.type === "income" ? "+" : "-"}
                    {transaction.amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                  </p>
                  <p className="text-sm text-secondary">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Overview (Pie Chart) */}
      <div className="card mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Category Overview</h2>
          <div className="flex gap-2">
            <button
              className={`btn ${activeChartType === "expense" ? "btn-danger" : "btn-outline"} text-sm`}
              onClick={() => setActiveChartType("expense")}
            >
              Expenses
            </button>
            <button
              className={`btn ${activeChartType === "income" ? "btn-success" : "btn-outline"} text-sm`}
              onClick={() => setActiveChartType("income")}
            >
              Income
            </button>
          </div>
        </div>

        {isLoadingReports ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin" size={24} />
            <span className="ml-2">Loading chart data...</span>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center p-8">
            <PieChartIcon size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="mb-2">No {activeChartType} data available yet</p>
            <Link to="/add-transaction" className="btn btn-primary">
              <PlusCircle size={18} />
              Add Transaction
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <PieChart
              data={chartData}
              colors={chartColors}
              totalLabel={activeChartType === "income" ? "Total Income" : "Total Expenses"}
            />

            {/* Legend */}
            <div>
              <div className="flex flex-col gap-4">
                {chartData.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: chartColors[index] }}></div>
                        <span>{item.category}</span>
                      </div>
                      <span>{item.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: chartColors[index],
                        }}
                      ></div>
                    </div>
                    <p className="text-sm text-secondary mt-1">
                      {item.amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Budget Categories */}
      <div className="card mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Budget Categories</h2>
          <Link to="/budget" className="btn btn-outline text-sm">
            Manage Budgets
          </Link>
        </div>

        {isLoadingBudgets ? (
          <div className="flex justify-center items-center h-32">
            <Loader className="animate-spin" size={24} />
            <span className="ml-2">Loading budgets...</span>
          </div>
        ) : budgets.length === 0 ? (
          <div className="text-center p-4">
            <p className="mb-2">No budgets set up yet</p>
            <Link to="/budget" className="btn btn-primary">
              <PlusCircle size={18} />
              Create Your First Budget
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {topBudgets.map((category, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} />
                    <span>{category.name}</span>
                  </div>
                  <div className="text-sm">
                    <span className={category.percentage > 100 ? "text-danger" : ""}>
                      {category.spent.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                    </span>
                    <span className="text-secondary">
                      {" "}
                      / {category.budget.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${category.percentage > 100 ? "bg-danger" : "bg-primary"}`}
                    style={{ width: `${Math.min(category.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Savings Goals */}
      <div className="card mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Savings Goals</h2>
          <Link to="/goals" className="btn btn-outline text-sm">
            Manage Goals
          </Link>
        </div>

        {isLoadingGoals ? (
          <div className="flex justify-center items-center h-32">
            <Loader className="animate-spin" size={24} />
            <span className="ml-2">Loading goals...</span>
          </div>
        ) : goals.length === 0 ? (
          <div className="text-center p-4">
            <p className="mb-2">No savings goals yet</p>
            <Link to="/goals" className="btn btn-primary">
              <PlusCircle size={18} />
              Create Your First Goal
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {topGoals.map((goal, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Target size={16} />
                    <span>{goal.name}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-primary">
                      {goal.current.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                    </span>
                    <span className="text-secondary">
                      {" "}
                      / {goal.target.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full bg-secondary" style={{ width: `${goal.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card mt-4">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/add-transaction" className="btn btn-primary">
            <PlusCircle size={18} />
            Add Transaction
          </Link>
          <Link to="/budget" className="btn btn-secondary">
            <Wallet size={18} />
            Manage Budget
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard