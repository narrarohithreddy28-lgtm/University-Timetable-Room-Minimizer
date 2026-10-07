import express from 'express';
import { db } from '../services/storage.js';

const router = express.Router();

router.get('/', (req, res) => {
  const departments = db.departments.find();
  res.json({ success: true, count: departments.length, data: departments });
});

router.post('/', (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) {
    return res.status(400).json({ success: false, message: 'Department name and code are required' });
  }
  const created = db.departments.create({ name, code: code.toUpperCase() });
  res.status(201).json({ success: true, data: created });
});

router.put('/:id', (req, res) => {
  const updated = db.departments.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Department not found' });
  }
  res.json({ success: true, data: updated });
});

router.delete('/:id', (req, res) => {
  const deleted = db.departments.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Department not found' });
  }
  res.json({ success: true, message: 'Department deleted successfully' });
});

export default router;
