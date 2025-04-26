"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Check, X, ArrowUpRight, ArrowDownRight } from "lucide-react"

const AddTransaction = ({ onAdd }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    type: "expense",
    category: "food",
    notes: "",
  })

  const [errors, setErrors] = useState({})

  const categories = [
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(formData.amount) || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const newTransaction = {
      type: formData.type,
      amount: Number.parseFloat(formData.amount),
      category: formData.category,
      description: formData.description,
      date: new Date(formData.date).toISOString(),
    }

    try {
      await onAdd(newTransaction)
      navigate("/transactions")
    } catch (error) {
      setErrors({
        ...errors,
        submit: error.message || "Failed to add transaction",
      })
    }
  }

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-4">Add Transaction</h1>

      <div className="mb-4">
        <div className="flex gap-4">
          <button
            type="button"
            className={`btn ${formData.type === "expense" ? "btn-danger" : "btn-outline"} w-full`}
            onClick={() => setFormData({ ...formData, type: "expense" })}
          >
            <ArrowDownRight size={18} />
            Expense
          </button>
          <button
            type="button"
            className={`btn ${formData.type === "income" ? "btn-success" : "btn-outline"} w-full`}
            onClick={() => setFormData({ ...formData, type: "income" })}
          >
            <ArrowUpRight size={18} />
            Income
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {errors.submit && <div className="p-3 mb-4 bg-red-100 text-danger rounded-lg">{errors.submit}</div>}

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`form-input ${errors.description ? "border-danger" : ""}`}
            placeholder="What was this transaction for?"
          />
          {errors.description && <p className="text-danger text-sm mt-1">{errors.description}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            Amount (IDR)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`form-input ${errors.amount ? "border-danger" : ""}`}
            placeholder="0"
            min="0"
            step="1000"
          />
          {errors.amount && <p className="text-danger text-sm mt-1">{errors.amount}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`form-select ${errors.category ? "border-danger" : ""}`}
          >
            {categories
              .filter((cat) =>
                formData.type === "income"
                  ? ["salary", "investment", "gift", "other"].includes(cat.value)
                  : !["salary", "investment"].includes(cat.value),
              )
              .map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
          </select>
          {errors.category && <p className="text-danger text-sm mt-1">{errors.category}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`form-input ${errors.date ? "border-danger" : ""}`}
          />
          {errors.date && <p className="text-danger text-sm mt-1">{errors.date}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="form-input"
            placeholder="Add any additional details"
            rows="3"
          ></textarea>
        </div>

        <div className="flex gap-4 mt-6">
          <button type="button" className="btn btn-outline w-full" onClick={() => navigate("/transactions")}>
            <X size={18} />
            Cancel
          </button>
          <button type="submit" className="btn btn-primary w-full">
            <Check size={18} />
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddTransaction
