import { Router } from 'express';
import { supabase } from '../lib/supabase.js';

const router = Router();

const formatTodo = (row) => ({
  id: row.id,
  title: row.title,
  done: row.done,
  createdAt: row.created_at
});

// GET /todos - List all tasks, newest first
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('id, title, done, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return next(error);
    }

    res.json((data || []).map(formatTodo));
  } catch (err) {
    next(err);
  }
});

// POST /todos - Add a task
router.post('/', async (req, res, next) => {
  try {
    const { title } = req.body || {};

    if (typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be text' });
    }

    const trimmed = title.trim();
    if (trimmed.length === 0 || trimmed.length > 200) {
      return res.status(400).json({ error: 'Title must be between 1 and 200 characters' });
    }

    const { data, error } = await supabase
      .from('todos')
      .insert({ title: trimmed, done: false })
      .select('id, title, done, created_at')
      .single();

    if (error) {
      return next(error);
    }

    res.status(201).json(formatTodo(data));
  } catch (err) {
    next(err);
  }
});

// PATCH /todos/:id - Change title and/or done
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, done } = req.body || {};

    if (title === undefined && done === undefined) {
      return res.status(400).json({ error: 'Provide title or done to update' });
    }

    const updates = {};

    if (title !== undefined) {
      if (typeof title !== 'string') {
        return res.status(400).json({ error: 'Title must be text' });
      }
      const trimmed = title.trim();
      if (trimmed.length === 0 || trimmed.length > 200) {
        return res.status(400).json({ error: 'Title must be between 1 and 200 characters' });
      }
      updates.title = trimmed;
    }

    if (done !== undefined) {
      if (typeof done !== 'boolean') {
        return res.status(400).json({ error: 'Done must be a boolean' });
      }
      updates.done = done;
    }

    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select('id, title, done, created_at');

    if (error) {
      return next(error);
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(formatTodo(data[0]));
  } catch (err) {
    next(err);
  }
});

// DELETE /todos/:id - Delete a task
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) {
      return next(error);
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
