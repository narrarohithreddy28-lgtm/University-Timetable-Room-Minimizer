import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : {
      id: 'user_admin',
      name: 'University Administrator',
      email: 'admin@mrtc.edu.in',
      role: 'admin'
    };
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || 'demo_token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('token', res.token);
      return res.user;
    } finally {
      setLoading(false);
    }
  };

  // 1-Click Demo Login Switcher
  const quickSwitchRole = (role) => {
    if (role === 'admin') {
      const adminUser = {
        id: 'user_admin',
        name: 'University Administrator',
        email: 'admin@mrtc.edu.in',
        role: 'admin'
      };
      setUser(adminUser);
    } else if (role === 'faculty') {
      const facultyUser = {
        id: 'fac_1',
        name: 'Dr. K. Rajesh',
        email: 'rajesh.cse@mrtc.edu.in',
        role: 'faculty',
        facultyId: 'FAC001',
        department: 'CSE'
      };
      setUser(facultyUser);
    } else if (role === 'student') {
      const studentUser = {
        id: 'user_student',
        name: 'Aditya Sharma',
        email: 'student.cse@mrtc.edu.in',
        role: 'student',
        department: 'CSE',
        sectionId: 'sec_cse_a',
        sectionName: 'CSE-A'
      };
      setUser(studentUser);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, quickSwitchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
