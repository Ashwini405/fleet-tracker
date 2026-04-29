const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY deadline ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new task
app.post('/tasks', async (req, res) => {
  const { task, module, deadline, status } = req.body;
  if (!task || !module || !deadline) {
    return res.status(400).json({ error: 'Task, module, and deadline are required.' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO tasks (task, module, deadline, status) VALUES (?, ?, ?, ?)',
      [task, module, deadline, status || 'Pending']
    );
    res.status(201).json({ id: result.insertId, task, module, deadline, status: status || 'Pending' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update task status
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  try {
    const [result] = await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all daily logs
app.get('/logs', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM daily_logs ORDER BY log_date DESC');
    const logs = rows.map(row => ({
      id: row.id,
      date: row.log_date instanceof Date ? row.log_date.toISOString().split('T')[0] : String(row.log_date).split('T')[0],
      updates: typeof row.updates === 'string' ? JSON.parse(row.updates) : row.updates,
      sharedBlockers: typeof row.shared_blockers === 'string' ? JSON.parse(row.shared_blockers) : row.shared_blockers,
    }));
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create or update a daily log (upsert)
app.post('/logs', async (req, res) => {
  const { id, date, updates, sharedBlockers } = req.body;
  if (!id || !date || !updates) {
    return res.status(400).json({ error: 'id, date, and updates are required.' });
  }
  try {
    await db.query(
      `INSERT INTO daily_logs (id, log_date, updates, shared_blockers)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE log_date = VALUES(log_date), updates = VALUES(updates), shared_blockers = VALUES(shared_blockers)`,
      [id, date, JSON.stringify(updates), JSON.stringify(sharedBlockers || [])]
    );
    res.status(201).json({ id, date, updates, sharedBlockers: sharedBlockers || [] });
  } catch (error) {
    console.error('Error saving log:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve React app for all other routes
app.get('*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
