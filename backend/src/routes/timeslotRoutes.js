import express from 'express';
import { db } from '../services/storage.js';

const router = express.Router();

router.get('/', (req, res) => {
  const timeslots = db.timeslots.find();
  timeslots.sort((a, b) => a.slotNumber - b.slotNumber);
  res.json({ success: true, count: timeslots.length, data: timeslots });
});

router.post('/', (req, res) => {
  const { slotNumber, startTime, endTime, label, isBreak, isAvailable } = req.body;
  if (!slotNumber || !startTime || !endTime) {
    return res.status(400).json({ success: false, message: 'Slot number, start time and end time are required' });
  }
  const created = db.timeslots.create({
    slotNumber: Number(slotNumber),
    startTime,
    endTime,
    label: label || `${startTime} - ${endTime}`,
    isBreak: !!isBreak,
    isAvailable: isAvailable !== undefined ? !!isAvailable : true
  });
  res.status(201).json({ success: true, data: created });
});

router.put('/:id', (req, res) => {
  const updated = db.timeslots.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Timeslot not found' });
  }
  res.json({ success: true, data: updated });
});

router.delete('/:id', (req, res) => {
  const deleted = db.timeslots.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Timeslot not found' });
  }
  res.json({ success: true, message: 'Timeslot deleted successfully' });
});

export default router;
