import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '../services/dbService';

const AuthContext = createContext();

const SESSION_KEY = 'lms_current_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
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
        const exists = students.some(s => s.username === user.username) || faculty.some(f => f.username === user.username);
        if (!exists) {
          setUser(null);
          localStorage.removeItem(SESSION_KEY);
        }
      } catch {
        setUser(null);
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const login = (username, password) => {
    setLoading(true);
    try {
      const loggedUser = dbService.loginUser(username, password);
      setUser(loggedUser);
      localStorage.setItem(SESSION_KEY, JSON.stringify(loggedUser));
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
    localStorage.removeItem(SESSION_KEY);
  };

  const updateProfile = (updatedUserObj) => {
    if (!updatedUserObj) return;
    setUser(updatedUserObj);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUserObj));
  };

  // Session persistence handles auto-login on refresh / browser restart
  useEffect(() => {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
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
