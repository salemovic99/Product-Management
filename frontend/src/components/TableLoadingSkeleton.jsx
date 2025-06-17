import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";
export default function TableLoadingSkeleton(){
    return (
        
            <div className="min-h-screen bg-gray-50">
              {/* Header */}
              <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="w-6 h-6" />
                      <div className="space-y-1">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-20 h-4" />
                      </div>
                    </div>
                    <Skeleton className="w-32 h-8" />
                  </div>
                </div>
              </div>
        
              {/* Stats */}
              <div className="m-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="w-10 h-5" />
                        <Skeleton className="w-12 h-5" />
                      </div>
                      <Skeleton className="w-8 h-8 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              </div>
        
              {/* Search and Table */}
              <Card className="m-5">
                <CardHeader>
                  <Skeleton className="w-64 h-6" />
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        {[1, 2, 3, 4].map((_, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <th className="px-6 py-4">
                              <Skeleton className="w-24 h-4" />
                            </th>
                            <th className="px-6 py-4">
                              <Skeleton className="w-32 h-4" />
                            </th>
                            <th className="px-6 py-4">
                              <Skeleton className="w-32 h-4" />
                            </th>
                            <th className="px-6 py-4 text-center">
                              <Skeleton className="w-16 h-4 mx-auto" />
                            </th>
                          </tr>
                        ))}
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {[1, 2, 3,4].map((_, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <Skeleton className="w-24 h-4" />
                            </td>
                            <td className="px-6 py-4">
                              <Skeleton className="w-32 h-4" />
                            </td>
                            <td className="px-6 py-4">
                              <Skeleton className="w-32 h-4" />
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Skeleton className="w-16 h-4 mx-auto" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
            
          );
}