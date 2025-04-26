const BASE_URL = "http://localhost:5000/api"

// ===== TRANSACTIONS API =====
export const fetchTransactions = async () => {
  const res = await fetch(`${BASE_URL}/transactions`)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to fetch transactions")
  }
  return res.json()
}

export const addTransaction = async (data) => {
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to add transaction")
  }
  return res.json()
}

export const deleteTransaction = async (id) => {
  const res = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to delete transaction")
  }
  return res.json()
}

export const updateTransaction = async (id, updatedTransaction) => {
  // Clean ID before sending
  const cleanId = id.toString().replace(/\D+/g, "")

  const res = await fetch(`${BASE_URL}/transactions/${cleanId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedTransaction),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || `Failed to update transaction (Status: ${res.status})`)
  }

  return res.json()
}

// ===== BUDGETS API =====
export const fetchBudgets = async () => {
  const res = await fetch(`${BASE_URL}/budgets`)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to fetch budgets")
  }
  return res.json()
}

export const addBudget = async (data) => {
  const res = await fetch(`${BASE_URL}/budgets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to add budget")
  }
  return res.json()
}

export const updateBudget = async (id, data) => {
  const res = await fetch(`${BASE_URL}/budgets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to update budget")
  }
  return res.json()
}

export const deleteBudget = async (id) => {
  const res = await fetch(`${BASE_URL}/budgets/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to delete budget")
  }
  return res.json()
}

export const updateBudgetSpent = async (id, spent) => {
  const res = await fetch(`${BASE_URL}/budgets/${id}/spent`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ spent }),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to update budget spent amount")
  }
  return res.json()
}

// ===== GOALS API =====
export const fetchGoals = async () => {
  const res = await fetch(`${BASE_URL}/goals`)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to fetch goals")
  }
  return res.json()
}

export const addGoal = async (data) => {
  const res = await fetch(`${BASE_URL}/goals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to add goal")
  }
  return res.json()
}

export const updateGoal = async (id, data) => {
  const res = await fetch(`${BASE_URL}/goals/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to update goal")
  }
  return res.json()
}

export const deleteGoal = async (id) => {
  const res = await fetch(`${BASE_URL}/goals/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to delete goal")
  }
  return res.json()
}

export const contributeToGoal = async (id, amount) => {
  const res = await fetch(`${BASE_URL}/goals/${id}/contribute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to add contribution to goal")
  }
  return res.json()
}

// ===== REPORTS API =====
export const fetchMonthlyReports = async (year) => {
  const queryParams = year ? `?year=${year}` : ""
  const res = await fetch(`${BASE_URL}/reports/monthly${queryParams}`)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to fetch monthly reports")
  }
  return res.json()
}

export const fetchCategoryReports = async (period = "month") => {
  const res = await fetch(`${BASE_URL}/reports/categories?period=${period}`)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || "Failed to fetch category reports")
  }
  return res.json()
}
