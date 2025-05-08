'use client'
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { stat } from 'fs';

export function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isLoading, signIn, signOut, status } = useAuth();
  console.log(user, isAuthenticated, isLoading, status);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (

    <div className="flex justify-between items-center w-full px-6 py-4 bg-black border-b border-gray-800 fixed top-0 z-50">
      {/* Left side - Logo */}
      <div className="text-white text-lg font-bold">
        SmartSnip
      </div>

      {/* Middle - Navigation Links */}
      <div className="flex space-x-6 text-sm">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
        <Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
        <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
        <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
      </div>

      {/* Right side - User Profile with Dropdown */}
      {
        isLoading ? (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse"></div>
          </div>
        ) : isAuthenticated ? (
          <div className="flex items-center">
            <DropdownMenu >
              <DropdownMenuTrigger className="text-white flex items-center space-x-2 p-2 rounded-md hover:bg-zinc-800 transition-colors">
                {!isLoading && (
                  <img
                    src={user?.image || 'https://via.placeholder.com/150'}
                    alt="User avatar"
                    className="h-8 w-8 rounded-full bg-zinc-700"
                  />
                )}
                <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                <ChevronDown className="h-4 w-4 text-zinc-400" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-zinc-800 border-zinc-700">
                <div className="px-4 py-3">
                  <p className="text-sm font-medium text-zinc-100">{user?.name}</p>
                  <p className="text-xs text-zinc-400 mt-1">{user?.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-zinc-700" />
                <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer text-white">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer text-red-400 focus:text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="px-5 py-2 rounded-lg bg-zinc-900 text-white font-semibold 
                      border border-zinc-700 shadow-md hover:shadow-blue-500/20 
                      hover:border-blue-600 transition-all duration-200 
                      ease-in-out hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            Sign In
          </button>

        
        )
      }
      
    </div>
  );
}