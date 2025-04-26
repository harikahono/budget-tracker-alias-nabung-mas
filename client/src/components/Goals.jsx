"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Edit2, Trash2, Target, TrendingUp, Loader } from "lucide-react"
import { fetchGoals, addGoal, updateGoal, deleteGoal, contributeToGoal } from "../services/api"

const Goals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    target: "",
    current: "",
    deadline: "",
    description: "",
  })

  // Fetch goals from API
  useEffect(() => {
    const getGoals = async () => {
      try {
        setLoading(true)
        const data = await fetchGoals()
        setGoals(data)
        setError(null)
      } catch (err) {
        console.error("Error fetching goals:", err)
        setError("Failed to load savings goals. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    getGoals()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleAddGoal = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const newGoal = {
        name: formData.name,
        target: Number.parseFloat(formData.target),
        current: formData.current ? Number.parseFloat(formData.current) : 0,
        deadline: formData.deadline || null,
        description: formData.description || null,
      }

      await addGoal(newGoal)

      // Refresh goals
      const updatedGoals = await fetchGoals()
      setGoals(updatedGoals)

      setFormData({ name: "", target: "", current: "", deadline: "", description: "" })
      setShowAddForm(false)
      setError(null)
    } catch (err) {
      console.error("Error adding goal:", err)
      setError("Failed to add goal. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleEditGoal = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const updatedGoal = {
        name: formData.name,
        target: Number.parseFloat(formData.target),
        current: formData.current ? Number.parseFloat(formData.current) : 0,
        deadline: formData.deadline || null,
        description: formData.description || null,
      }

      await updateGoal(editingGoal.id, updatedGoal)

      // Refresh goals
      const updatedGoals = await fetchGoals()
      setGoals(updatedGoals)

      setFormData({ name: "", target: "", current: "", deadline: "", description: "" })
      setEditingGoal(null)
      setError(null)
    } catch (err) {
      console.error("Error updating goal:", err)
      setError("Failed to update goal. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (goal) => {
    setEditingGoal(goal)
    setFormData({
      name: goal.name,
      target: goal.target,
      current: goal.current,
      deadline: goal.deadline,
      description: goal.description,
    })
  }

  const handleDeleteGoal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this savings goal?")) {
      return
    }

    try {
      setLoading(true)
      await deleteGoal(id)

      // Refresh goals
      const updatedGoals = await fetchGoals()
      setGoals(updatedGoals)

      setError(null)
    } catch (err) {
      console.error("Error deleting goal:", err)
      setError("Failed to delete goal. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const addContribution = async (id, amount) => {
    try {
      setLoading(true)
      await contributeToGoal(id, amount)

      // Refresh goals
      const updatedGoals = await fetchGoals()
      setGoals(updatedGoals)

      setError(null)
    } catch (err) {
      console.error("Error adding contribution:", err)
      setError("Failed to add contribution. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && goals.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin" size={32} />
        <span className="ml-2">Loading savings goals...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Savings Goals</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowAddForm(true)
            setEditingGoal(null)
            setFormData({ name: "", target: "", current: "", deadline: "", description: "" })
          }}
        >
          <PlusCircle size={18} />
          Add Goal
        </button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      {/* Add/Edit Goal Form */}
      {(showAddForm || editingGoal) && (
        <div className="card mb-4">
          <h2 className="text-xl font-bold mb-4">{editingGoal ? "Edit Savings Goal" : "Add New Savings Goal"}</h2>

          <form onSubmit={editingGoal ? handleEditGoal : handleAddGoal}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Goal Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., Emergency Fund"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="target" className="form-label">
                Target Amount (IDR)
              </label>
              <input
                type="number"
                id="target"
                name="target"
                value={formData.target}
                onChange={handleChange}
                className="form-input"
                placeholder="0"
                min="0"
                step="10000"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="current" className="form-label">
                Current Amount (IDR)
              </label>
              <input
                type="number"
                id="current"
                name="current"
                value={formData.current}
                onChange={handleChange}
                className="form-input"
                placeholder="0"
                min="0"
                step="10000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="deadline" className="form-label">
                Target Date
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                placeholder="What are you saving for?"
                rows="3"
              ></textarea>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                className="btn btn-outline w-full"
                onClick={() => {
                  setShowAddForm(false)
                  setEditingGoal(null)
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader size={18} className="animate-spin mr-2" />
                    {editingGoal ? "Updating..." : "Adding..."}
                  </span>
                ) : editingGoal ? (
                  "Update Goal"
                ) : (
                  "Add Goal"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      <div className="grid gap-4">
        {goals.length === 0 ? (
          <div className="card text-center p-8">
            <p className="text-lg mb-4">No savings goals yet</p>
            <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
              <PlusCircle size={18} />
              Create Your First Goal
            </button>
          </div>
        ) : (
          goals.map((goal) => {
            const percentComplete = goal.target > 0 ? (goal.current / goal.target) * 100 : 0
            const daysLeft = goal.deadline
              ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
              : null

            return (
              <div key={goal.id} className="card">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Target size={20} color="var(--secondary)" />
                    <h3 className="text-xl font-bold">{goal.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-outline text-sm p-2" onClick={() => startEdit(goal)}>
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn btn-outline text-sm p-2"
                      onClick={() => handleDeleteGoal(goal.id)}
                      disabled={loading}
                    >
                      <Trash2 size={16} color="var(--danger)" />
                    </button>
                  </div>
                </div>

                {goal.description && <p className="text-secondary mb-4">{goal.description}</p>}

                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">
                      {goal.current.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                      <span className="text-secondary">
                        {" "}
                        / {goal.target.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                      </span>
                    </span>
                    <span className="text-sm">{percentComplete.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full bg-secondary" style={{ width: `${percentComplete}%` }}></div>
                  </div>
                </div>

                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-sm text-secondary">Remaining</p>
                    <p className="font-bold">
                      {(goal.target - goal.current).toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
                    </p>
                  </div>

                  {daysLeft !== null && (
                    <div className="text-right">
                      <p className="text-sm text-secondary">Time Left</p>
                      <p className="font-bold">{daysLeft > 0 ? `${daysLeft} days` : "Deadline passed"}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    className="btn btn-primary w-full"
                    onClick={() => {
                      const amount = Number.parseFloat(prompt("Enter contribution amount:") || "0")
                      if (amount > 0) {
                        addContribution(goal.id, amount)
                      }
                    }}
                    disabled={loading}
                  >
                    <TrendingUp size={18} />
                    Add Contribution
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default Goals
