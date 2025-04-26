"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Check, X } from "lucide-react"
import { updateTransaction } from "../services/api"

const EditTransaction = ({ transactions, onUpdate }) => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const transaction = transactions.find((t) => t.id === Number.parseInt(id))
    if (transaction) {
      setFormData({
        description: transaction.description || "",
        amount: transaction.amount || "",
      })
    } else {
      navigate("/transactions")
    }
  }, [id, transactions, navigate])

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

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const updatedTransaction = {
        description: formData.description,
        amount: Number.parseFloat(formData.amount),
      }

      await updateTransaction(id, updatedTransaction)

      // Update the local state with the updated transaction
      if (onUpdate) {
        onUpdate(Number.parseInt(id), updatedTransaction)
      }

      navigate("/transactions")
    } catch (error) {
      console.error("Error updating transaction:", error)
      setErrors({ submit: error.message || "Failed to update transaction" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      <h1 className="text-2xl font-bold mb-4">Edit Transaction</h1>

      <form onSubmit={handleSubmit}>
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

        {errors.submit && <div className="p-3 mb-4 bg-red-100 text-danger rounded-lg">{errors.submit}</div>}

        <div className="flex gap-4 mt-6">
          <button
            type="button"
            className="btn btn-outline w-full"
            onClick={() => navigate("/transactions")}
            disabled={isLoading}
          >
            <X size={18} />
            Cancel
          </button>
          <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Updating...
              </span>
            ) : (
              <>
                <Check size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditTransaction
