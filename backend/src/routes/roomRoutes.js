import express from 'express';
import { db } from '../services/storage.js';

const router = express.Router();

router.get('/', (req, res) => {
  const rooms = db.rooms.find();
  res.json({ success: true, count: rooms.length, data: rooms });
});

router.post('/', (req, res) => {
  const { roomNumber, building, floor, capacity, roomType, equipment, isAvailable } = req.body;
  if (!roomNumber) {
    return res.status(400).json({ success: false, message: 'Room number is required' });
  }
  const created = db.rooms.create({
    roomNumber,
    building: building || 'Academic Block A',
    floor: floor || '1st Floor',
    capacity: Number(capacity) || 70,
    roomType: roomType || 'Classroom',
    equipment: equipment || ['Projector', 'Whiteboard'],
    isAvailable: isAvailable !== undefined ? isAvailable : true
  });
  res.status(201).json({ success: true, data: created });
});

router.put('/:id', (req, res) => {
  const updated = db.rooms.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }
  res.json({ success: true, data: updated });
});

router.delete('/:id', (req, res) => {
  const deleted = db.rooms.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Room not found' });
  }
  res.json({ success: true, message: 'Room deleted successfully' });
});

// GET /api/rooms/utilization
router.get('/utilization', (req, res) => {
  const rooms = db.rooms.find();
  const timeslots = db.timeslots.find({ isBreak: false, isAvailable: true });
  const timetable = db.timetables.getLatest();
  const workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const totalSlotsPerRoom = workingDays.length * (timeslots.length || 7);

  const entries = timetable ? timetable.entries : [];
  const usedRoomIds = new Set(entries.map(e => e.roomId));

  const utilizationData = rooms.map(room => {
    const roomEntries = entries.filter(e => e.roomId === room.id);
    const occupiedSlots = roomEntries.length;
    const freeSlots = Math.max(0, totalSlotsPerRoom - occupiedSlots);
    const utilizationPercent = totalSlotsPerRoom > 0 ? Math.round((occupiedSlots / totalSlotsPerRoom) * 100) : 0;

    return {
      id: room.id,
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      building: room.building,
      floor: room.floor,
      capacity: room.capacity,
      isUsed: usedRoomIds.has(room.id),
      totalSlots: totalSlotsPerRoom,
      occupiedSlots,
      freeSlots,
      utilizationPercent,
      equipment: room.equipment
    };
  });

  const totalRooms = rooms.length;
  const usedRooms = usedRoomIds.size;
  const roomsSaved = Math.max(0, totalRooms - usedRooms);
  const reductionPercent = totalRooms > 0 ? Math.round((roomsSaved / totalRooms) * 100) : 0;
  const overallUtilization = utilizationData.filter(r => r.isUsed).length > 0
    ? Math.round(utilizationData.filter(r => r.isUsed).reduce((a, b) => a + b.utilizationPercent, 0) / usedRooms)
    : 0;

  res.json({
    success: true,
    data: {
      totalRooms,
      usedRooms,
      roomsSaved,
      reductionPercent,
      overallUtilization,
      roomDetails: utilizationData
    }
  });
});

export default router;
