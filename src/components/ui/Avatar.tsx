import React from 'react';

interface AvatarProps {
  name: string;
  className?: string;
}

export function Avatar({ name, className = '' }: AvatarProps) {
  return (
    <div 
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 ${className}`}
      title={name}
    >
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
        />
      </svg>
    </div>
  );
}
