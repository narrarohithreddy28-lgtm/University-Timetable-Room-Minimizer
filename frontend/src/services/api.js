const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => request('/auth/me'),

  // Departments
  getDepartments: () => request('/departments'),
  createDepartment: (dept) => request('/departments', { method: 'POST', body: JSON.stringify(dept) }),
  updateDepartment: (id, dept) => request(`/departments/${id}`, { method: 'PUT', body: JSON.stringify(dept) }),
  deleteDepartment: (id) => request(`/departments/${id}`, { method: 'DELETE' }),

  // Faculty
  getFaculty: () => request('/faculty'),
  createFaculty: (fac) => request('/faculty', { method: 'POST', body: JSON.stringify(fac) }),
  updateFaculty: (id, fac) => request(`/faculty/${id}`, { method: 'PUT', body: JSON.stringify(fac) }),
  deleteFaculty: (id) => request(`/faculty/${id}`, { method: 'DELETE' }),

  // Subjects
  getSubjects: () => request('/subjects'),
  createSubject: (sub) => request('/subjects', { method: 'POST', body: JSON.stringify(sub) }),
  updateSubject: (id, sub) => request(`/subjects/${id}`, { method: 'PUT', body: JSON.stringify(sub) }),
  deleteSubject: (id) => request(`/subjects/${id}`, { method: 'DELETE' }),

  // Sections
  getSections: () => request('/sections'),
  createSection: (sec) => request('/sections', { method: 'POST', body: JSON.stringify(sec) }),
  updateSection: (id, sec) => request(`/sections/${id}`, { method: 'PUT', body: JSON.stringify(sec) }),
  deleteSection: (id) => request(`/sections/${id}`, { method: 'DELETE' }),

  // Rooms
  getRooms: () => request('/rooms'),
  createRoom: (rm) => request('/rooms', { method: 'POST', body: JSON.stringify(rm) }),
  updateRoom: (id, rm) => request(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(rm) }),
  deleteRoom: (id) => request(`/rooms/${id}`, { method: 'DELETE' }),
  getRoomUtilization: () => request('/rooms/utilization'),

  // Time Slots
  getTimeSlots: () => request('/timeslots'),
  createTimeSlot: (slot) => request('/timeslots', { method: 'POST', body: JSON.stringify(slot) }),
  updateTimeSlot: (id, slot) => request(`/timeslots/${id}`, { method: 'PUT', body: JSON.stringify(slot) }),
  deleteTimeSlot: (id) => request(`/timeslots/${id}`, { method: 'DELETE' }),

  // Timetable
  getTimetable: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/timetable${query ? `?${query}` : ''}`);
  },
  generateTimetable: (payload) => request('/timetable/generate', { method: 'POST', body: JSON.stringify(payload) }),
  optimizeTimetable: () => request('/timetable/optimize', { method: 'POST' }),
  updateTimetableEntry: (id, entryData) => request(`/timetable/entry/${id}`, { method: 'PUT', body: JSON.stringify(entryData) }),
  getConflicts: () => request('/timetable/conflicts'),
  clearTimetable: () => request('/timetable', { method: 'DELETE' }),

  // Reports & Seed
  getReports: () => request('/reports'),
  resetDemo: () => request('/reports/reset-demo', { method: 'POST' })
};
