import React from 'react';
import { Edit, Trash2,MoreHorizontal  } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from 'next/image';

export const LocationTable = ({ locations, onEdit, onDelete }) => {
  if (locations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className='flex justify-center items-center'>
            <Image src="/No-data-pana.svg" alt='no data'  width={200} height={200}></Image>
        </div>
        <div className="text-gray-400 text-lg mb-2">No Locations found</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Location Name
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
              Google Map Link
            </th>
            <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {locations.map((location) => (
            <tr key={location.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{location.name}</div>
                <div className="text-sm text-gray-500">ID: {location.id}</div>
              </td>
              <td className="px-6 py-4">
                <div>
                  {location.google_map_link?.substring(0, 25)}
                  {location.google_map_link?.length > 25 && '...'}
                </div>
              </td>

              <td className="px-6 py-4">
                    <div className="flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <button
                            aria-label="Open actions menu"
                            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            <MoreHorizontal className="h-5 w-5 text-gray-500  " />
                        </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48">
                        

                        <DropdownMenuItem asChild>
                            <button
                                onClick={() => onEdit(location)}
                                className="p-2 cursor-pointer"
                                title="Edit location"
                            >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit location
                            </button>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                            <button
                                className=" px-3 py-1 text-red-600 hover:text-red-800 flex items-center  cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                                >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </button>   
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                Are you sure you want to delete this location? This action
                                cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(location.id)}>
                                Continue
                                </AlertDialogAction>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </div>
              </td>

             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};