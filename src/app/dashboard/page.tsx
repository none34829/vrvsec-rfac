'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/Card';
import { useData } from '@/contexts/DataContext';
import { formatRelativeTime } from '@/lib/activity';

// Extend the Window interface to include our custom method
interface ExtendedWindow extends Window {
  addDashboardActivity?: (type: 'user_added' | 'role_modified' | 'permission_updated', title: string, description: string) => void;
}

export default function DashboardPage() {
  const { users, roles, permissions, activities, addActivity } = useData();
  const [lastBackupTime, setLastBackupTime] = useState(new Date().toISOString());
  const [, setUpdateTrigger] = useState(0);

  // Memoize addLocalActivity with useCallback
  const addLocalActivity = useCallback((type: 'user_added' | 'role_modified' | 'permission_updated', title: string, description: string) => {
    addActivity(type, title, description);
    setLastBackupTime(new Date().toISOString());
  }, [addActivity]);

  // Export addActivity function to make it available to other components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as ExtendedWindow).addDashboardActivity = addLocalActivity;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as ExtendedWindow).addDashboardActivity;
      }
    };
  }, [addLocalActivity]);

  const stats = [
    { name: 'Total Users', value: users.length },
    { name: 'Active Roles', value: roles.length },
    { name: 'Permissions', value: permissions.length },
  ];

  // Update relative times every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTrigger(prev => prev + 1);
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-500">Welcome to VRV Security RBAC Management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <div className="p-4 sm:p-6">
              <div className="text-sm font-medium text-gray-500">{stat.name}</div>
              <div className="mt-2 text-2xl sm:text-3xl font-semibold">{stat.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium">Recent Activity</h3>
            <div className="mt-4 space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                    {formatRelativeTime(activity.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-medium">System Status</h3>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">System Health</p>
                  <p className="text-xs sm:text-sm text-green-500">All systems operational</p>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Last Backup</p>
                  <p className="text-xs sm:text-sm text-gray-500">{formatRelativeTime(lastBackupTime)}</p>
                </div>
                <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
