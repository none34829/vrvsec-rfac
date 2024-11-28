'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';
import {
  HelpCircle,
  Bell,
  User,
  Settings,
  Key,
  LogOut,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/DropdownMenu';

export function Header() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">VRV Security</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          {/* Help Icon with Tooltip */}
          <div className="relative group">
            <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </div>
            <div className="absolute hidden group-hover:flex items-center -left-8 -bottom-10 bg-gray-800 text-white px-3 py-1 rounded-md whitespace-nowrap">
              <span className="mr-1">😊</span> Help Desk
            </div>
          </div>

          {/* Notification Bell */}
          <div className="relative group">
            <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">
              <Bell className="h-5 w-5 text-gray-600" />
            </div>
            <div className="absolute hidden group-hover:block -left-6 -bottom-10 bg-gray-800 text-white px-3 py-1 rounded-md whitespace-nowrap">
              Notifications
            </div>
          </div>

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary transition-all">
                  <img
                    src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff"
                    alt="Admin"
                    className="h-full w-full object-cover"
                  />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                <User className="h-4 w-4" />
                <span>View Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer">
                <Key className="h-4 w-4" />
                <span>Change Password</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2 cursor-pointer text-red-600">
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
