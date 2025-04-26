const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Setup koneksi ke database SQLite
const db = new sqlite3.Database(path.join(__dirname, "budget.db"), (err) => {
  if (err) return console.error(err.message);
  console.log("🗃️  Terkoneksi ke SQLite database.");
});

// Buat tabel transactions jika belum ada
db.run(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- income atau expense
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL
  )
`);

// Buat tabel budgets jika belum ada
db.run(`
  CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    spent REAL DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Buat tabel goals jika belum ada
db.run(`
  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    target REAL NOT NULL,
    current REAL DEFAULT 0,
    deadline TEXT,
    description TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Buat tabel goal_contributions jika belum ada (untuk mencatat kontribusi ke goals)
db.run(`
  CREATE TABLE IF NOT EXISTS goal_contributions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    goal_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (goal_id) REFERENCES goals (id) ON DELETE CASCADE
  )
`);

// ===== TRANSACTION ROUTES =====

// Route GET - semua transaksi
app.get("/api/transactions", (req, res) => {
  db.all("SELECT * FROM transactions ORDER BY date DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Route POST - tambah transaksi
app.post("/api/transactions", (req, res) => {
  const { type, amount, category, description, date } = req.body;
  if (!type || !amount || !category || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  db.run(
    `INSERT INTO transactions (type, amount, category, description, date) VALUES (?, ?, ?, ?, ?)`,
    [type, amount, category, description, date],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Route DELETE - hapus transaksi
app.delete("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM transactions WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Transaksi dihapus." });
  });
});

// Route PUT - update transaksi
app.put("/api/transactions/:id", (req, res) => {
  const { id } = req.params;
  const { description, amount } = req.body;

  // Validasi ID harus angka
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ 
      error: "Invalid ID format",
      received: id,
      expected: "Numeric ID" 
    });
  }

  // Validasi input
  if (!description || amount === undefined) {
    return res.status(400).json({ 
      error: "Missing required fields",
      required: ["description", "amount"]
    });
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ 
      error: "Invalid amount",
      received: amount,
      expected: "Positive number"
    });
  }

  db.run(
    `UPDATE transactions SET description = ?, amount = ? WHERE id = ?`,
    [description, numericAmount, id],
    function (err) {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ 
          error: "Database operation failed",
          details: err.message 
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ 
          error: "No transaction updated",
          possibleReasons: [
            "ID doesn't exist",
            "Data identical to current values"
          ]
        });
      }
      
      res.json({ 
        success: true,
        changes: this.changes,
        message: "Transaksi berhasil diupdate"
      });
    }
  );
});

// ===== BUDGET ROUTES =====

// Route GET - semua budget
app.get("/api/budgets", (req, res) => {
  db.all("SELECT * FROM budgets ORDER BY category", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Route POST - tambah budget
app.post("/api/budgets", (req, res) => {
  const { category, name, amount } = req.body;
  if (!category || !name || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ 
      error: "Invalid amount",
      expected: "Positive number"
    });
  }

  db.run(
    `INSERT INTO budgets (category, name, amount, spent) VALUES (?, ?, ?, 0)`,
    [category, name, numericAmount],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Route PUT - update budget
app.put("/api/budgets/:id", (req, res) => {
  const { id } = req.params;
  const { category, name, amount } = req.body;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  if (!category || !name || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  db.run(
    `UPDATE budgets SET category = ?, name = ?, amount = ? WHERE id = ?`,
    [category, name, numericAmount, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Budget not found" });
      res.json({ success: true, message: "Budget berhasil diupdate" });
    }
  );
});

// Route DELETE - hapus budget
app.delete("/api/budgets/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM budgets WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Budget not found" });
    res.json({ message: "Budget dihapus." });
  });
});

// Route PUT - update spent amount (untuk memperbarui jumlah yang sudah digunakan)
app.put("/api/budgets/:id/spent", (req, res) => {
  const { id } = req.params;
  const { spent } = req.body;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  if (spent === undefined) {
    return res.status(400).json({ error: "Missing spent amount" });
  }

  const numericSpent = parseFloat(spent);
  if (isNaN(numericSpent) || numericSpent < 0) {
    return res.status(400).json({ error: "Invalid spent amount" });
  }

  db.run(
    `UPDATE budgets SET spent = ? WHERE id = ?`,
    [numericSpent, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: "Budget not found" });
      res.json({ success: true, message: "Budget spent amount updated" });
    }
  );
});

// ===== GOALS ROUTES =====

// Route GET - semua goals
app.get("/api/goals", (req, res) => {
  db.all("SELECT * FROM goals ORDER BY deadline", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Route POST - tambah goal
app.post("/api/goals", (req, res) => {
  const { name, target, current, deadline, description } = req.body;
  if (!name || !target) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const numericTarget = parseFloat(target);
  if (isNaN(numericTarget) || numericTarget <= 0) {
    return res.status(400).json({ error: "Invalid target amount" });
  }

  const numericCurrent = current ? parseFloat(current) : 0;
  if (isNaN(numericCurrent) || numericCurrent < 0) {
    return res.status(400).json({ error: "Invalid current amount" });
  }

  db.run(
    `INSERT INTO goals (name, target, current, deadline, description) VALUES (?, ?, ?, ?, ?)`,
    [name, numericTarget, numericCurrent, deadline || null, description || null],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Route PUT - update goal
app.put("/api/goals/:id", (req, res) => {
  const { id } = req.params;
  const { name, target, current, deadline, description } = req.body;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  if (!name || !target) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const numericTarget = parseFloat(target);
  if (isNaN(numericTarget) || numericTarget <= 0) {
    return res.status(400).json({ error: "Invalid target amount" });
  }

  const numericCurrent = current !== undefined ? parseFloat(current) : null;
  if (numericCurrent !== null && (isNaN(numericCurrent) || numericCurrent < 0)) {
    return res.status(400).json({ error: "Invalid current amount" });
  }

  let query = `UPDATE goals SET name = ?, target = ?`;
  let params = [name, numericTarget];

  if (numericCurrent !== null) {
    query += `, current = ?`;
    params.push(numericCurrent);
  }

  if (deadline !== undefined) {
    query += `, deadline = ?`;
    params.push(deadline || null);
  }

  if (description !== undefined) {
    query += `, description = ?`;
    params.push(description || null);
  }

  query += ` WHERE id = ?`;
  params.push(id);

  db.run(query, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Goal not found" });
    res.json({ success: true, message: "Goal berhasil diupdate" });
  });
});

// Route DELETE - hapus goal
app.delete("/api/goals/:id", (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM goals WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: "Goal not found" });
    res.json({ message: "Goal dihapus." });
  });
});

// Route POST - tambah kontribusi ke goal
app.post("/api/goals/:id/contribute", (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  if (!amount) {
    return res.status(400).json({ error: "Missing amount" });
  }

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  // Begin transaction
  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    // Add contribution record
    db.run(
      `INSERT INTO goal_contributions (goal_id, amount) VALUES (?, ?)`,
      [id, numericAmount],
      function (err) {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).json({ error: err.message });
        }

        // Update current amount in goal
        db.run(
          `UPDATE goals SET current = current + ? WHERE id = ?`,
          [numericAmount, id],
          function (err) {
            if (err) {
              db.run("ROLLBACK");
              return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
              db.run("ROLLBACK");
              return res.status(404).json({ error: "Goal not found" });
            }

            db.run("COMMIT");
            res.json({ 
              success: true, 
              message: "Kontribusi berhasil ditambahkan",
              contribution_id: this.lastID
            });
          }
        );
      }
    );
  });
});

// ===== REPORTS ROUTES =====

// Route GET - monthly summary (income, expense, savings by month)
app.get("/api/reports/monthly", (req, res) => {
  const { year } = req.query;
  
  // Default to current year if not specified
  const targetYear = year || new Date().getFullYear();
  
  const query = `
    SELECT 
      strftime('%m', date) as month,
      SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense,
      SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as savings
    FROM transactions
    WHERE strftime('%Y', date) = ?
    GROUP BY strftime('%m', date)
    ORDER BY month
  `;
  
  db.all(query, [targetYear.toString()], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Route GET - category breakdown (expenses by category)
app.get("/api/reports/categories", (req, res) => {
  const { period } = req.query;
  
  let dateFilter = "";
  if (period === "month") {
    // Current month
    dateFilter = `WHERE strftime('%Y-%m', date) = strftime('%Y-%m', 'now')`;
  } else if (period === "year") {
    // Current year
    dateFilter = `WHERE strftime('%Y', date) = strftime('%Y', 'now')`;
  }
  
  const query = `
    SELECT 
      category,
      SUM(amount) as amount,
      (SUM(amount) * 100.0 / (SELECT SUM(amount) FROM transactions WHERE type = 'expense' ${dateFilter})) as percentage
    FROM transactions
    WHERE type = 'expense' ${dateFilter}
    GROUP BY category
    ORDER BY amount DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});