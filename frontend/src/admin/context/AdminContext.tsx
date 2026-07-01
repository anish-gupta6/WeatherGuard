import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';

export interface WeatherData {
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
}

export interface UserItem {
  _id: string;
  name: string;
  email: string;
  city: string;
  status: string;
  role: string;
  createdAt: string;
}

interface AdminContextType {
  users: UserItem[];
  usersLoading: boolean;
  weather: WeatherData | null;
  weatherLoading: boolean;
  weatherError: boolean;
  updateUserStatus: (id: string, status: string) => Promise<void>;
  addAdmin: (email: string) => Promise<void>;
  removeAdmin: (id: string) => Promise<void>;
  refreshData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(false);
  const { socket } = useSocket();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users/all');
      setUsers(res.data);
    } catch {
      console.error('Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchWeather = async () => {
    try {
      const res = await api.get('/users/me/weather');
      setWeather(res.data);
      setWeatherError(false);
    } catch {
      setWeatherError(true);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWeather();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleUserCreated = (newUser: UserItem) => {
      setUsers((prev) => {
        // Prevent duplicates
        if (prev.some((u) => u._id === newUser._id)) return prev;
        return [...prev, newUser];
      });
    };

    const handleUserUpdated = (updatedUser: UserItem) => {
      setUsers((prev) => prev.map((u) => (u._id === updatedUser._id ? updatedUser : u)));
    };

    socket.on('userCreated', handleUserCreated);
    socket.on('userUpdated', handleUserUpdated);

    return () => {
      socket.off('userCreated', handleUserCreated);
      socket.off('userUpdated', handleUserUpdated);
    };
  }, [socket]);

  const refreshData = () => {
    fetchUsers();
    fetchWeather();
  };

  const updateUserStatus = async (id: string, status: string) => {
    try {
      await api.put(`/users/${id}/status`, { status });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status } : u))
      );
    } catch {
      alert(`Failed to update user status to ${status}`);
      throw new Error(`Failed to update user status to ${status}`);
    }
  };

  const addAdmin = async (email: string) => {
    try {
      await api.post('/users/admins', { email });
      // The socket event 'userCreated' will handle adding the new user to state
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add admin');
      throw error;
    }
  };

  const removeAdmin = async (id: string) => {
    try {
      await api.delete(`/users/admins/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to remove admin');
      throw error;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        usersLoading,
        weather,
        weatherLoading,
        weatherError,
        updateUserStatus,
        addAdmin,
        removeAdmin,
        refreshData,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
