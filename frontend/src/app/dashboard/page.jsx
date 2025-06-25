"use client";
import React, { useEffect, useState } from "react";
import {
  Package,
  Users,
  MapPin,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { useUser } from "@clerk/nextjs";

// const API_BASE_URL = "http://127.0.0.1:8000";
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const Dashboard = () => {

  const { isLoaded, isSignedIn, user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [productsCount, setProductsCount] = useState(null);
  const [employeesCount, setEmployeesCount] = useState(null);
  const [locationsCount, setLocationsCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchCounts = async () => {
      
      try {
        const [productsRes, employeesRes, locationsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products/count`),
          fetch(`${API_BASE_URL}/employees/count`),
          fetch(`${API_BASE_URL}/locations/count`)
        ]);

        const [productsData, employeesData, locationsData] = await Promise.all([
          productsRes.json(),
          employeesRes.json(),
          locationsRes.json()
        ]);

        setProductsCount(productsData.count);
        setEmployeesCount(employeesData.count);
        setLocationsCount(locationsData.count);
        console.log( "api url : " + API_BASE_URL)
        console.log( "api url env : " + process.env.NEXT_PUBLIC_BACKEND_URL)
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
    setTimeout(() => {
      setLoading(false)
    }, 1);
  }, []);

  const stats = [
    { name: "Total Products", value: productsCount, icon: Package },
    { name: "Total Employees", value: employeesCount, icon: Users },
    { name: "Total Locations", value: locationsCount, icon: MapPin }
  ];

  if(loading)
  {
    return (
        <div className="min-h-screen">
          <div className="flex bg-gray-50 dark:bg-gray-900">
            <div className="flex-1 lg:ml-50">
              <main className="p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8 space-y-2">
                  <Skeleton className="h-8 w-64" />
                  <Skeleton className="h-4 w-80" />
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-7 w-7 rounded-md" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-6 w-20" />
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Chart Skeleton */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <Skeleton className="h-5 w-40" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 rounded-lg bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 flex items-center justify-center">
                      <Skeleton className="w-16 h-16 rounded-full mb-4" />
                    </div>
                  </CardContent>
                </Card>
              </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-40" />
          </div>
        </div>
      )
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <div className="flex bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 lg:ml-50">
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.fullName}!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Here's what's happening with your business today.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {stats.map((stat) => (
                <Card key={stat.name} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.name}
                    </CardTitle>
                    <stat.icon className="w-7 h-7 text-indigo-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-light text-gray-900 dark:text-white">
                      {stat.value !== null ? stat.value :  <Skeleton className={'w-20 h-6'}></Skeleton>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Chart Placeholder */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Chart Overview</CardTitle>
                <CardDescription>Chart</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Chart visualization would go here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
