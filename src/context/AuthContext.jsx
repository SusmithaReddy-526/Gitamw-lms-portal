import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/dbService';

const AuthContext = createContext();

const SESSION_KEY = 'lms_current_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      // Clear legacy permanent localStorage session key to prevent persistent login on tab reopen
      localStorage.removeItem(SESSION_KEY);
      
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Validate session user against current database - clear stale sessions if database wiped
    if (user && user.role !== 'admin') {
      try {
        const students = dbService.getStudentsList();
        const faculty = dbService.getFacultyList();
        const cleanUser = (user.username || '').toLowerCase().trim();
        const cleanEmpId = (user.employeeId || '').toLowerCase().trim();
        const cleanRoll = (user.rollNumber || '').toString().toLowerCase().trim();

        const exists = students.some(s => 
          (s.username || '').toLowerCase().trim() === cleanUser || 
          (s.rollNumber || '').toString().toLowerCase().trim() === cleanUser ||
          (cleanRoll && (s.rollNumber || '').toString().toLowerCase().trim() === cleanRoll)
        ) || faculty.some(f => 
          (f.username || '').toLowerCase().trim() === cleanUser || 
          (f.employeeId || '').toLowerCase().trim() === cleanUser ||
          (cleanEmpId && (f.employeeId || '').toLowerCase().trim() === cleanEmpId)
        );

        if (!exists) {
          setUser(null);
          sessionStorage.removeItem(SESSION_KEY);
        }
      } catch {
        // Safe fallback - keep existing session active if DB lookup warning occurs
      }
    }
  }, []);

  const login = (username, password) => {
    setLoading(true);
    try {
      const loggedUser = dbService.loginUser(username, password);
      setUser(loggedUser);
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(loggedUser));
      setLoading(false);
      return loggedUser;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const registerStudent = (studentData) => {
    setLoading(true);
    try {
      const newStudent = dbService.registerStudent(studentData);
      setLoading(false);
      return newStudent;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const registerFaculty = (facultyData) => {
    setLoading(true);
    try {
      const newFaculty = dbService.registerFaculty(facultyData);
      setLoading(false);
      return newFaculty;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const registerAdmin = (adminData) => {
    setLoading(true);
    try {
      const newAdmin = dbService.registerAdmin(adminData);
      setLoading(false);
      return newAdmin;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  };

  const updateProfile = (updatedUserObj) => {
    if (!updatedUserObj) return;
    setUser(updatedUserObj);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(updatedUserObj));
    } catch (e) {}
  };

  // Session persistence within current tab session only
  useEffect(() => {
    if (user) {
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
      } catch (e) {}
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      registerStudent, 
      registerFaculty, 
      registerAdmin, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
