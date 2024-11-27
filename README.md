# VRV Security - RBAC Management System

A modern, secure Role-Based Access Control (RBAC) management system built with Next.js 15, React, and Tailwind CSS.

## Features

### 1. Dashboard Overview
- Real-time statistics display (Total Users, Active Roles, Permissions)
- Recent activity monitoring with timestamp tracking
- System status monitoring with health indicators
- Last backup time tracking

### 2. User Management
- Create, view, edit, and delete user accounts
- Assign multiple roles to users
- User activity tracking
- Search and filter users
- Bulk user operations

### 3. Role Management
- Create and manage custom roles
- Assign multiple permissions to roles
- Role hierarchy visualization
- Role-based access restrictions
- Prevent deletion of system-critical roles (e.g., Super Admin)

### 4. Permission Management
- Granular permission control
- Module-based permission organization
- Action-based permissions (Create, Read, Update, Delete)
- Permission inheritance through roles
- Custom permission creation

### 5. Activity Monitoring
- Real-time activity tracking
- Detailed activity logs with timestamps
- Activity filtering by type
- User action auditing
- System event logging

### 6. Security Features
- Role-based access control (RBAC)
- Permission-based authorization
- Secure routing and middleware protection
- Activity logging for security audits
- System health monitoring

### 7. User Interface
- Modern, responsive design
- Interactive data tables
- Real-time updates
- Toast notifications for user feedback
- Modal dialogs for data entry
- Searchable dropdown menus

### 8. Data Management
- Context-based state management
- Real-time data updates
- Data validation and error handling
- Mock data support for testing
- Backup time tracking

### 9. Component Features
- Reusable UI components
- Custom form controls
- Interactive modals and dialogs
- Toast notifications system
- Loading states and animations
- Error boundary handling
- Responsive layout components

### 10. Technical Features
- Next.js 15 app router
- React 19 with server components
- Tailwind CSS for styling
- TypeScript for type safety
- Radix UI for accessible components
- Client-side data caching
- Responsive design system
- Custom hooks for business logic

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - Reusable React components
- `/src/contexts` - React context providers
- `/src/lib` - Utility functions and constants
- `/src/types` - TypeScript type definitions
- `/src/hooks` - Custom React hooks

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI
- Class Variance Authority
- PostCSS

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
