"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Edit2, Trash2, CreditCard, Loader } from "lucide-react"
import { fetchBudgets, addBudget, updateBudget, deleteBudget } from "../services/api"

const Budget = ({ transactions }) => {
  const [budgets, setBudgets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState(null)
  const [formData, setFormData] = useState({
    category: "",
    name: "",
    amount: "",
  })

  const categories = [
    { value: "food", label: "Food & Dining" },
    { value: "transportation", label: "Transportation" },
    { value: "entertainment", label: "Entertainment" },
    { value: "shopping", label: "Shopping" },
    { value: "utilities", label: "Utilities" },
    { value: "housing", label: "Housing" },
    { value: "healthcare", label: "Healthcare" },
    { value: "education", label: "Education" },
    { value: "other", label: "Other" },
  ]

  // Fetch budgets from API
  useEffect(() => {
    const getBudgets = async () => {
      try {
        setLoading(true)
        const data = await fetchBudgets()
        setBudgets(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching budgets:", err)
        setError("Failed to load budgets. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    getBudgets()
  }, [])

  // Calculate spent amounts based on transactions
  useEffect(() => {
    if (!transactions.length) return

    // Create a map of category to total spent
    const categorySpent = {}
    transactions.forEach((transaction) => {
      if (transaction.type === "expense") {
        const category = transaction.category
        categorySpent[category] = (categorySpent[category] || 0) + transaction.amount
      }
    })

    // Update budgets with spent amounts using functional update
    setBudgets(prevBudgets => {
      if (!prevBudgets.length) return prevBudgets
      return prevBudgets.map(budget => ({
        ...budget,
        spent: categorySpent[budget.category] || 0
      }))
    })
  }, [transactions])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAddBudget = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const newBudget = {
        category: formData.category,
        name: categories.find((c) => c.value === formData.category)?.label || formData.category,
        amount: Number.parseFloat(formData.amount),
      }

      await addBudget(newBudget)

      // Refresh budgets
      const updatedBudgets = await fetchBudgets()
      setBudgets(updatedBudgets)

      setFormData({ category: "", name: "", amount: "" })
      setShowAddForm(false)
      setError(null)
    } catch (err) {
      console.error("Error adding budget:", err)
      setError("Failed to add budget. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEditBudget = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const updatedBudget = {
        category: formData.category,
        name: categories.find((c) => c.value === formData.category)?.label || formData.category,
        amount: Number.parseFloat(formData.amount),
      }

      await updateBudget(editingBudget.id, updatedBudget)

      // Refresh budgets
      const updatedBudgets = await fetchBudgets()
      setBudgets(updatedBudgets)

      setFormData({ category: "", name: "", amount: "" })
      setEditingBudget(null)
      setError(null)
    } catch (err) {
      console.error("Error updating budget:", err)
      setError("Failed to update budget. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (budget) => {
    setEditingBudget(budget)
    setFormData({
      category: budget.category,
      name: budget.name,
      amount: budget.amount,
    })
  }

  const handleDeleteBudget = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) {
      return
    }

    try {
      setLoading(true)
      await deleteBudget(id)

      // Refresh budgets
      const updatedBudgets = await fetchBudgets()
      setBudgets(updatedBudgets)

      setError(null)
    } catch (err) {
      console.error("Error deleting budget:", err)
      setError("Failed to delete budget. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Calculate total budget and spent
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0)
  const percentSpent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  if (loading && budgets.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" size={32} />
        <span className="ml-2">Loading budgets...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Budget Management</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowAddForm(true)
            setEditingBudget(null)
            setFormData({ category: "", name: "", amount: "" })
          }}
        >
          <PlusCircle size={18} />
          Add Budget
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* Budget Overview */}
      <div className="card mb-4">
        <h2 className="text-xl font-bold mb-4">Monthly Budget Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-secondary mb-1">Total Budget</p>
            <p className="text-2xl font-bold">
              {totalBudget.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
            </p>
          </div>

          <div>
            <p className="text-sm text-secondary mb-1">Total Spent</p>
            <p className="text-2xl font-bold">
              {totalSpent.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
            </p>
          </div>

          <div>
            <p className="text-sm text-secondary mb-1">Remaining</p>
            <p className="text-2xl font-bold">
              {(totalBudget - totalSpent).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
            </p>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm">Budget Usage</span>
            <span className="text-sm">{percentSpent.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${percentSpent > 100 ? "bg-danger" : "bg-primary"}`}
              style={{ width: `${Math.min(percentSpent, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Add/Edit Budget Form */}
      {(showAddForm || editingBudget) && (
        <div className="card mb-4">
          <h2 className="text-xl font-bold mb-4">{editingBudget ? "Edit Budget" : "Add New Budget"}</h2>

          <form onSubmit={editingBudget ? handleEditBudget : handleAddBudget}>
            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="amount" className="form-label">
                Budget Amount (IDR)
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="form-input"
                placeholder="0"
                min="0"
                step="10000"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                className="btn btn-outline w-full"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingBudget(null)
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader size={18} className="animate-spin mr-2" />
                    {editingBudget ? "Updating..." : "Adding..."}
                  </span>
                ) : editingBudget ? (
                  "Update Budget"
                ) : (
                  "Add Budget"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget List */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Your Budgets</h2>

        {budgets.length === 0 ? (
          <p className="text-center p-4">No budgets set up yet. Add your first budget!</p>
        ) : (
          <div className="grid gap-4">
            {budgets.map((budget) => {
              const percentUsed = budget.amount > 0 ? ((budget.spent || 0) / budget.amount) * 100 : 0
              const isOverBudget = percentUsed > 100

              return (
                <div key={budget.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard size={18} />
                      <h3 className="font-bold">{budget.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-outline text-sm p-2" onClick={() => startEdit(budget)}>
                        <Edit2 size={16} />
                      </button>
                      <button
                        className="btn btn-outline text-sm p-2"
                        onClick={() => handleDeleteBudget(budget.id)}
                        disabled={loading}
                      >
                        <Trash2 size={16} color="var(--danger)" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between mb-1">
                    <span className="text-sm">
                      {(budget.spent || 0).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                      <span className="text-secondary">
                        {" "}
                        / {budget.amount.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                      </span>
                    </span>
                    <span className={`text-sm ${isOverBudget ? "text-danger" : ""}`}>{percentUsed.toFixed(1)}%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${isOverBudget ? "bg-danger" : "bg-primary"}`}
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    ></div>
                  </div>

                  {isOverBudget && (
                    <p className="text-sm text-danger mt-1">
                      Over budget by{" "}
                      {((budget.spent || 0) - budget.amount).toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Budget