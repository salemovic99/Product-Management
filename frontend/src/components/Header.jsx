"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar"
import { toast } from "sonner"
import { Menu, Search, Sun, Moon, User, LogOut, LogOutIcon } from "lucide-react";
import { useState, useEffect } from 'react';
import React from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'



export default function Header({ darkMode, setDarkMode,toggleSidebar  }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
 

  
  return (
    // Header component for the dashboard
    <header className="bg-white w-[100%] dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-4">
 
          
          {/* Theme Toggle */}
          <Button
            className={'cursor-pointer'}
            variant="ghost"
            size="sm"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <SignedOut>
              <SignInButton className={`cursor-pointer px-4 py-1 border border-black rounded-lg bg-slate-950 text-white hover:bg-slate-800`} />
             
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

          
        </div>
      </div>
    </header>
  );
}