"use client";
import React, { useState } from 'react';
import { 
  Home, 
  BarChart3, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Menu, 
  X,
  TrendingUp,
  DollarSign,
  Activity,
  Download,
  Plus,
  ChevronDown,
  User,
  LogOut,
  Moon,
  Sun,
  Building,
  Layout,
  Box,
  LocationEdit,
  BriefcaseBusiness,
  QrCode,
  Award
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from "@clerk/nextjs";

const DashboardSideBar = ({ sidebarOpen, setSidebarOpen, darkMode }) => {
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [darkMode, setDarkMode] = useState(false);
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useUser()

  // ✅ Wait for Clerk to load to avoid hydration mismatch
  if (!isLoaded) return null;
  
  const isAdmin = user?.publicMetadata?.role === 'admin'

  const navigation = [
    { name: 'Dashboard', icon: Home, href: '/dashboard', current: true },
    { name: 'Products', icon: Box, href: '/dashboard/products', current: false },
    { name: 'Locations', icon: LocationEdit, href: '/dashboard/locations', current: false },
    { name: 'Employees', icon: BriefcaseBusiness, href: '/dashboard/employees', current: false },
    { name: 'Positions', icon: Award, href: '/dashboard/positions', current: false },
    { name: 'Scan QR Code', icon: QrCode, href: '/dashboard/qrcodescan', current: false },
    ...(isAdmin ? [{ name: 'Users', icon: Users, href: '/admin' }] : []),
    { name: 'Settings', icon: Settings, href: '#', current: false },
  ];
  


 

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex bg-gray-50  dark:bg-gray-900">
        
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex flex-col  h-full">
            
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg"></div>
                <Link href={'/dashboard'}>
                <span className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</span>
                </Link>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            
            <nav className="flex-1 px-4 py-4 space-y-2">
                   {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link href={item.href} key={item.name} passHref className="block">
                    <Button
                    onClick={() => setSidebarOpen(false)}
                      variant={isActive ? 'default' : 'ghost'}
                      className={`cursor-pointer w-full justify-start ${
                        isActive
                          ? 'bg-purple-500 hover:bg-purple-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}

              

            </nav>

            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={`${user.imageUrl}`} />
                  <AvatarFallback>JD</AvatarFallback>
                  {console.log(user)}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.fullName || user?.firstName || 'john doe'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user?.emailAddresses[0]?.emailAddress}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default DashboardSideBar;