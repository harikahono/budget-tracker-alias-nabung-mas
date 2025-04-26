"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Calendar, Download, Filter, Loader } from "lucide-react"
import { fetchMonthlyReports, fetchCategoryReports } from "../services/api"

const Reports = ({ transactions }) => {
  const [period, setPeriod] = useState("month")
  const [year, setYear] = useState(new Date().getFullYear())
  const [monthlyData, setMonthlyData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch report data
  useEffect(() => {
    const getReportData = async () => {
      try {
        setLoading(true)

        // Fetch monthly data
        const monthlyReports = await fetchMonthlyReports(year)

        // Format the data
        const formattedMonthlyData = monthlyReports.map((report) => ({
          month: getMonthName(report.month),
          income: report.income || 0,
          expense: report.expense || 0,
          savings: report.savings || 0,
        }))

        setMonthlyData(formattedMonthlyData)

        // Fetch category data
        const categoryReports = await fetchCategoryReports(period)
        setCategoryData(categoryReports)

        setError(null)
      } catch (err) {
        console.error("Error fetching reports:", err)
        setError("Failed to load reports. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    getReportData()
  }, [year, period])

  // Helper function to get month name from number
  const getMonthName = (monthNum) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months[Number.parseInt(monthNum) - 1]
  }

  // Calculate total income and expenses
  const totalIncome = monthlyData.reduce((sum, month) => sum + month.income, 0)
  const totalExpenses = monthlyData.reduce((sum, month) => sum + month.expense, 0)
  const savings = totalIncome - totalExpenses
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0

  if (loading && monthlyData.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" size={32} />
        <span className="ml-2">Loading reports...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Financial Reports</h1>
        <button className="btn btn-outline">
          <Download size={18} />
          Export Reports
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* Filters */}
      <div className="card mb-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="form-label">Time Period</label>
            <select value={period} onChange={(e) => setPeriod(e.target.value)} className="form-select">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div>
            <label className="form-label">Year</label>
            <select value={year} onChange={(e) => setYear(e.target.value)} className="form-select">
              {[...Array(5)].map((_, i) => {
                const yearValue = new Date().getFullYear() - i
                return (
                  <option key={yearValue} value={yearValue}>
                    {yearValue}
                  </option>
                )
              })}
            </select>
          </div>

          <div className="ml-auto self-end">
            <button className="btn btn-outline">
              <Filter size={18} />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} color="var(--success)" />
            <h3 className="font-bold">Total Income</h3>
          </div>
          <p className="text-2xl font-bold text-success">
            {totalIncome.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
          </p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={20} color="var(--danger)" />
            <h3 className="font-bold">Total Expenses</h3>
          </div>
          <p className="text-2xl font-bold text-danger">
            {totalExpenses.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
          </p>
        </div>

        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={20} color="var(--primary)" />
            <h3 className="font-bold">Savings</h3>
          </div>
          <p className="text-2xl font-bold">
            {savings.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
          </p>
          <p className="text-sm text-secondary">Savings Rate: {savingsRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Income vs Expenses Chart */}
      <div className="card mb-4">
        <h2 className="text-xl font-bold mb-4">Income vs Expenses</h2>
        {monthlyData.length === 0 ? (
          <p className="text-center p-4">No data available for the selected period</p>
        ) : (
          <>
            <div className="h-64 flex items-end justify-between gap-2">
              {monthlyData.map((data, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-2"
                  style={{ width: `${100 / monthlyData.length}%` }}
                >
                  <div className="w-full flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-green-200 rounded-t-sm"
                      style={{
                        height: `${(data.income / (Math.max(...monthlyData.map((d) => Math.max(d.income, d.expense))) || 1)) * 200}px`,
                      }}
                    ></div>
                    <div
                      className="w-full bg-red-200 rounded-t-sm"
                      style={{
                        height: `${(data.expense / (Math.max(...monthlyData.map((d) => Math.max(d.income, d.expense))) || 1)) * 200}px`,
                      }}
                    ></div>
                  </div>
                  <span className="text-xs">{data.month}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-8 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                <span className="text-sm">Income</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-200 rounded-sm"></div>
                <span className="text-sm">Expense</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Expense Breakdown */}
      <div className="card mb-4">
        <h2 className="text-xl font-bold mb-4">Expense Breakdown</h2>
        {categoryData.length === 0 ? (
          <p className="text-center p-4">No expense data available for the selected period</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex flex-col gap-4">
                {categoryData.map((cat, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span>{cat.category}</span>
                      <span>{cat.percentage ? cat.percentage.toFixed(1) : 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-primary" style={{ width: `${cat.percentage || 0}%` }}></div>
                    </div>
                    <p className="text-sm text-secondary mt-1">
                      {cat.amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-sm text-secondary">Total</p>
                    <p className="font-bold">
                      {totalExpenses.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                    </p>
                  </div>
                </div>
                {/* This would be a pie chart in a real implementation */}
                <div className="w-full h-full rounded-full border-8 border-primary"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Monthly Trends */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Monthly Trends</h2>
        <div className="overflow-x-auto">
          {monthlyData.length === 0 ? (
            <p className="text-center p-4">No data available for the selected period</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Month</th>
                  <th className="text-right p-2">Income</th>
                  <th className="text-right p-2">Expenses</th>
                  <th className="text-right p-2">Savings</th>
                  <th className="text-right p-2">Savings Rate</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData.map((data, index) => {
                  const monthlySavings = data.income - data.expense
                  const monthlySavingsRate = data.income > 0 ? (monthlySavings / data.income) * 100 : 0

                  return (
                    <tr key={index} className="border-b">
                      <td className="p-2">{data.month}</td>
                      <td className="text-right p-2 text-success">
                        {data.income.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                      </td>
                      <td className="text-right p-2 text-danger">
                        {data.expense.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                      </td>
                      <td className="text-right p-2">
                        {monthlySavings.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                      </td>
                      <td className="text-right p-2">{monthlySavingsRate.toFixed(1)}%</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports
