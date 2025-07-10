"use client";
import Image from "next/image";
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      redirect('/dashboard');
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          {/* Logo Container with Animation */}
          <div className="mb-8 animate-pulse">
            <div className="w-24 h-24 mx-auto mb-4  flex items-center justify-center ">
              <Image src={'/logo.png'} alt="logo" width={90} height={90}></Image>
            </div>
          </div>

          {/* Three Dots Animation */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}