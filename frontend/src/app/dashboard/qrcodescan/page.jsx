"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle , CardFooter} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

import { Plus, Search, MapPin, Building2, Edit2, Edit, Trash2, Eye, Box, Menu,BadgeCheckIcon,BadgeX,ReceiptText, QrCode } from 'lucide-react';

import { Skeleton } from "../../../components/ui/skeleton"
import QRCodeScanner from '../../../components/QRCodeScanner';



export default function QRCode() {
    const [darkMode, setDarkMode] = useState(false);
  
      return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-gray-50`}>
      <div className="container mx-auto px-4 py-10">
        <Card className="bg-white shadow-md dark:bg-gray-800">
          <CardHeader className="flex flex-col items-center space-y-2 text-center">
            <CardTitle className="text-xl font-semibold">
              QR Code Scanner
            </CardTitle>
            <CardDescription>
              Scan QR codes to retrieve product information.
            </CardDescription>
          </CardHeader>

          <CardContent>
            
            <div className="flex justify-center">
              <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg shadow-sm border-0 bg-white/70 backdrop-blur-sm">
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="w-32 h-32 bg-white rounded-lg shadow-sm flex items-center justify-center border-2 border-dashed border-purple-300">
                      <QrCode className="h-16 w-16 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>

          {/* Actual scanner component */}
          <div className="px-4 pb-4">
            <QRCodeScanner />
          </div>
        </Card>
      </div>
    </div>
  );
}