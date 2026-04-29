const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
