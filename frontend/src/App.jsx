import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import OptimizationResultModal from './components/OptimizationResultModal';

import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import DepartmentsPage from './pages/DepartmentsPage';
import FacultyPage from './pages/FacultyPage';
import SubjectsPage from './pages/SubjectsPage';
import SectionsPage from './pages/SectionsPage';
import RoomsPage from './pages/RoomsPage';
import TimeSlotsPage from './pages/TimeSlotsPage';
import GenerateTimetablePage from './pages/GenerateTimetablePage';
import TimetablePage from './pages/TimetablePage';
import RoomUtilizationPage from './pages/RoomUtilizationPage';
import ConflictsPage from './pages/ConflictsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

import { api } from './services/api';
import { exportToPDF, exportToExcel } from './services/exportService';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { user } = useAuth();

  // Navigation: start on landing page or dashboard
  const [activePage, setActivePage] = useState('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // App data states
  const [departments, setDepartments] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [sections, setSections] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [timetable, setTimetable] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  // Optimization Result modal
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);

  // Load all data on mount
  const loadAllData = async () => {
    try {
      const [
        deptsRes,
        facRes,
        subRes,
        secRes,
        rmRes,
        slotsRes,
        ttRes,
        repRes
      ] = await Promise.all([
        api.getDepartments().catch(() => ({ data: [] })),
        api.getFaculty().catch(() => ({ data: [] })),
        api.getSubjects().catch(() => ({ data: [] })),
        api.getSections().catch(() => ({ data: [] })),
        api.getRooms().catch(() => ({ data: [] })),
        api.getTimeSlots().catch(() => ({ data: [] })),
        api.getTimetable().catch(() => ({ data: null })),
        api.getReports().catch(() => ({ data: null }))
      ]);

      setDepartments(deptsRes.data || []);
      setFaculty(facRes.data || []);
      setSubjects(subRes.data || []);
      setSections(secRes.data || []);
      setRooms(rmRes.data || []);
      setTimeSlots(slotsRes.data || []);
      if (ttRes.data) setTimetable(ttRes.data);
      if (repRes.data) setReports(repRes);
    } catch (err) {
      console.error("Data loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleTimetableGenerated = (newTimetable) => {
    setTimetable(newTimetable);
    setIsResultModalOpen(true);
    // Refresh reports
    api.getReports().then(r => setReports(r)).catch(() => {});
  };

  const handleExportPDF = () => {
    if (!timetable) return;
    exportToPDF({
      title: "Optimized University Timetable",
      subtitle: "Malla Reddy Technical Campus",
      entries: timetable.entries || [],
      timeSlots: timeSlots,
      filterLabel: "Complete Campus Master",
      stats: timetable.stats || {}
    });
  };

  const handleExportExcel = () => {
    if (!timetable) return;
    exportToExcel({
      entries: timetable.entries || [],
      roomDetails: timetable.stats?.roomDetails || [],
      stats: timetable.stats || {}
    });
  };

  const handleResetDemo = async () => {
    await api.resetDemo();
    await loadAllData();
  };

  // If on public Landing Page, render LandingPage layout
  if (activePage === 'landing') {
    return (
      <LandingPage
        onGetStarted={(target = 'dashboard') => setActivePage(target)}
      />
    );
  }

  const conflictsCount = timetable ? (timetable.conflicts?.length || 0) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
        conflictCount={conflictsCount}
        onResetDemo={handleResetDemo}
        onNavigate={(page) => setActivePage(page)}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activePage={activePage}
          onNavigate={(page) => setActivePage(page)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activePage === 'dashboard' && (
            <DashboardPage
              reportsData={reports || {}}
              timetableData={timetable || {}}
              onNavigate={(page) => setActivePage(page)}
              onOpenOptimizer={() => setActivePage('generate')}
            />
          )}

          {activePage === 'timetable' && (
            <TimetablePage
              timetable={timetable || {}}
              departments={departments}
              sections={sections}
              facultyList={faculty}
              roomList={rooms}
              subjectList={subjects}
              timeSlots={timeSlots}
              onTimetableUpdated={loadAllData}
            />
          )}

          {activePage === 'generate' && (
            <GenerateTimetablePage
              departments={departments}
              sections={sections}
              rooms={rooms}
              timeSlots={timeSlots}
              onTimetableGenerated={handleTimetableGenerated}
            />
          )}

          {activePage === 'room-utilization' && (
            <RoomUtilizationPage
              roomDetails={timetable?.stats?.roomDetails || []}
              stats={timetable?.stats || {}}
            />
          )}

          {activePage === 'departments' && (
            <DepartmentsPage
              departments={departments}
              onRefresh={loadAllData}
            />
          )}

          {activePage === 'faculty' && (
            <FacultyPage
              faculty={faculty}
              departments={departments}
              subjects={subjects}
              onRefresh={loadAllData}
            />
          )}

          {activePage === 'subjects' && (
            <SubjectsPage
              subjects={subjects}
              departments={departments}
              onRefresh={loadAllData}
            />
          )}

          {activePage === 'sections' && (
            <SectionsPage
              sections={sections}
              departments={departments}
              onRefresh={loadAllData}
            />
          )}

          {activePage === 'rooms' && (
            <RoomsPage
              rooms={rooms}
              onRefresh={loadAllData}
            />
          )}

          {activePage === 'timeslots' && (
            <TimeSlotsPage
              timeSlots={timeSlots}
              onRefresh={loadAllData}
            />
          )}

          {activePage === 'conflicts' && (
            <ConflictsPage
              conflicts={timetable?.conflicts || []}
              onRunOptimizer={() => setActivePage('generate')}
              onResolveClick={() => setActivePage('timetable')}
            />
          )}

          {activePage === 'reports' && (
            <ReportsPage
              reportsData={reports || {}}
              timetable={timetable || {}}
              timeSlots={timeSlots}
            />
          )}

          {activePage === 'settings' && (
            <SettingsPage
              onResetDemo={handleResetDemo}
            />
          )}
        </main>
      </div>

      {/* Optimization Complete Modal */}
      {isResultModalOpen && (
        <OptimizationResultModal
          isOpen={isResultModalOpen}
          onClose={() => setIsResultModalOpen(false)}
          stats={timetable?.stats || {}}
          onViewTimetable={() => {
            setIsResultModalOpen(false);
            setActivePage('timetable');
          }}
          onViewRoomAllocation={() => {
            setIsResultModalOpen(false);
            setActivePage('room-utilization');
          }}
          onRegenerate={() => {
            setIsResultModalOpen(false);
            setActivePage('generate');
          }}
          onExportPDF={handleExportPDF}
          onExportExcel={handleExportExcel}
        />
      )}
    </div>
  );
}
