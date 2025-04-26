"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import SideBar from "./components/SideBar"
import Header from "./components/Header"
import AddTransaction from "./components/AddTransaction"
import EditTransaction from "./components/EditTransaction"
import TransactionList from "./components/TransactionList"
import Budget from "./components/Budget"
import Goals from "./components/Goals"
import Reports from "./components/Reports"
import Settings from "./components/Settings"
import {
  fetchTransactions,
  addTransaction as addTransactionAPI,
  deleteTransaction as deleteTransactionAPI,
} from "./services/api"
import "./App.css"

function App() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const data = await fetchTransactions()
        setTransactions(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching transactions:", error)
        setLoading(false)
      }
    }

    getTransactions()
  }, [])

  const addTransaction = async (transaction) => {
    try {
      const result = await addTransactionAPI(transaction)
      // Fetch the updated list to ensure we have the correct ID
      const updatedTransactions = await fetchTransactions()
      setTransactions(updatedTransactions)
      return result
    } catch (error) {
      console.error("Error adding transaction:", error)
      throw error
    }
  }

  const deleteTransaction = async (id) => {
    try {
      await deleteTransactionAPI(id)
      setTransactions(transactions.filter((transaction) => transaction.id !== id))
    } catch (error) {
      console.error("Error deleting transaction:", error)
      throw error
    }
  }

  const updateTransactionInState = (id, updatedData) => {
    setTransactions(
      transactions.map((transaction) => (transaction.id === id ? { ...transaction, ...updatedData } : transaction)),
    )
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Router>
      <div className="app-container">
        <SideBar isOpen={sidebarOpen} />
        <div className={`main-content ${sidebarOpen ? "" : "expanded"}`}>
          <Header toggleSidebar={toggleSidebar} />
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Dashboard transactions={transactions} loading={loading} />} />
              <Route
                path="/transactions"
                element={<TransactionList transactions={transactions} onDelete={deleteTransaction} loading={loading} />}
              />
              <Route path="/add-transaction" element={<AddTransaction onAdd={addTransaction} />} />
              <Route
                path="/edit-transaction/:id"
                element={<EditTransaction transactions={transactions} onUpdate={updateTransactionInState} />}
              />
              <Route path="/budget" element={<Budget transactions={transactions} />} />
              <Route path="/goals" element={<Goals />} />
              <Route path="/reports" element={<Reports transactions={transactions} />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
