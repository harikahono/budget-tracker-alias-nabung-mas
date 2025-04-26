"use client"

import { useState } from "react"
import { User, Bell, Lock, DollarSign, HelpCircle, LogOut } from "lucide-react"

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile")
  const [formData, setFormData] = useState({
    name: "harikahono",
    email: "@gmail.com",
    currency: "IDR",
    language: "id",
    theme: "light",
    notifications: {
      email: true,
      push: true,
      weekly: false,
    },
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      setFormData({
        ...formData,
        notifications: {
          ...formData.notifications,
          [name]: checked,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Save settings logic would go here
    alert("Settings saved successfully!")
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: <User size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "security", label: "Security", icon: <Lock size={18} /> },
    { id: "preferences", label: "Preferences", icon: <DollarSign size={18} /> },
    { id: "help", label: "Help & Support", icon: <HelpCircle size={18} /> },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-4">
        {/* Tabs */}
        <div className="card">
          <ul className="space-y-1">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`w-full flex items-center gap-2 p-3 rounded-lg transition-colors ${
                    activeTab === tab.id ? "bg-primary text-white" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              </li>
            ))}
            <li className="mt-4 pt-4 border-t">
              <button className="w-full flex items-center gap-2 p-3 rounded-lg text-danger hover:bg-gray-100 transition-colors">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div className="card">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <button type="submit" className="btn btn-primary mt-4">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "notifications" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Notification Settings</h2>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-secondary">Receive transaction summaries via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="email"
                        checked={formData.notifications.email}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Push Notifications</h3>
                      <p className="text-sm text-secondary">Get notified about important updates</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="push"
                        checked={formData.notifications.push}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Weekly Summary</h3>
                      <p className="text-sm text-secondary">Receive weekly financial reports</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="weekly"
                        checked={formData.notifications.weekly}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary mt-6">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "preferences" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Preferences</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="currency" className="form-label">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="IDR">Indonesian Rupiah (IDR)</option>
                    <option value="USD">US Dollar (USD)</option>
                    <option value="EUR">Euro (EUR)</option>
                    <option value="JPY">Japanese Yen (JPY)</option>
                    <option value="SGD">Singapore Dollar (SGD)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="language" className="form-label">
                    Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="theme" className="form-label">
                    Theme
                  </label>
                  <select
                    id="theme"
                    name="theme"
                    value={formData.theme}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary mt-4">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Security Settings</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="current-password" className="form-label">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    className="form-input"
                    placeholder="Enter your current password"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="new-password" className="form-label">
                    New Password
                  </label>
                  <input type="password" id="new-password" className="form-input" placeholder="Enter new password" />
                </div>

                <div className="form-group">
                  <label htmlFor="confirm-password" className="form-label">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="form-input"
                    placeholder="Confirm new password"
                  />
                </div>

                <button type="submit" className="btn btn-primary mt-4">
                  Update Password
                </button>
              </form>

              <div className="mt-8 pt-6 border-t">
                <h3 className="font-bold mb-2">Two-Factor Authentication</h3>
                <p className="text-secondary mb-4">Add an extra layer of security to your account</p>
                <button className="btn btn-outline">Enable 2FA</button>
              </div>
            </div>
          )}

          {activeTab === "help" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Help & Support</h2>

              <div className="space-y-4">
                <div className="card bg-gray-50 p-4">
                  <h3 className="font-bold mb-2">Frequently Asked Questions</h3>
                  <p className="text-secondary mb-2">Find answers to common questions about Nabung Mas</p>
                  <button className="btn btn-outline">View FAQs</button>
                </div>

                <div className="card bg-gray-50 p-4">
                  <h3 className="font-bold mb-2">Contact Support</h3>
                  <p className="text-secondary mb-2">Need help? Our support team is here for you</p>
                  <button className="btn btn-outline">Contact Us</button>
                </div>

                <div className="card bg-gray-50 p-4">
                  <h3 className="font-bold mb-2">User Guide</h3>
                  <p className="text-secondary mb-2">Learn how to use Nabung Mas effectively</p>
                  <button className="btn btn-outline">Read Guide</button>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold mb-2">App Information</h3>
                <p className="text-secondary">Version: 1.0.0</p>
                <p className="text-secondary">© 2025 Nabung Mas. All rights reserved.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings
