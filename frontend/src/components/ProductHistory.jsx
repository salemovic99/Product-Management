import React from 'react';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useState, useEffect } from 'react';
import { Skeleton } from './ui/skeleton';
import { Clock, User, CalendarDays } from 'lucide-react';
import { toast } from 'sonner';
import productHistoryService from '@/services/productHistoryService';
import locationsService from '@/services/locationService';
import employeesService from '@/services/employeeService';


const ProductHistory = (productId) => {

    const[productHistory, setProductHistory] = useState([]);
    const [error, setError] = useState("");
    const [loadingProductHistory, setLoadingProductHistory] = useState(true);
    const [loading, setLoading] = useState(true);
    
    const fetchProductHistory = async ()=>{

        try {
            
          const result = await productHistoryService.getProductHistory(productId.productId);

          if (result) {
            // Enrich each item with employee names
            const enrichedHistory = await Promise.all(
            result.map(async (item) => {
                const prevEmpName = await fetchEmployeeName(item.previous_employee_id);
                const newEmpName = await fetchEmployeeName(item.new_employee_id);
                const prevLocName = await fetchLocationName(item.previous_location_id);
                const newLocName = await fetchLocationName(item.new_location_id);

                return {
                ...item,
                previous_employee_name: prevEmpName,
                new_employee_name: newEmpName,
                previous_location_name: prevLocName,
                new_location_name: newLocName
                };
            })
            );
            
            setProductHistory(enrichedHistory);

          } else {
            setError("Failed to load product history data");
          }
        } catch (err) {
          setError("Error loading product history: " + err.message);
          toast.error("Error loading product history: ",{
            description:err.message
          })
        } finally {
          setLoadingProductHistory(false);  
          setLoading(false)
               
        }
    }
    

  const format = (timestamp) => {
   return new Date(timestamp).toLocaleString();
  };

  const fetchEmployeeName = async (id) => {
  if (!id) return 'Unassigned';
  try {
    const result = await employeesService.getEmployeeById(id);
    if (!result) throw new Error();
  
    return result.name;
  } catch {
    return `Employee ${id}`;
  }
};


const fetchLocationName = async (id) => {
  if (!id) return 'Unassigned';
  try {
    const result = await locationsService.getLocationById(id);
    if (!result) throw new Error();
    return result.name;
  } catch {
    return `Location ${id}`;
  }
};

  const getLocationName = (id) => {
    if (!id) return 'None';
    return 'Warehouse A';
  };

   useEffect(() => {
    fetchProductHistory();
  }, [productId]);
 

  if(loading)
  {
     return (
    <div className="max-w-4xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-6 w-20 rounded-md" />
      </div>

      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="p-4">
            <CardContent className="p-0 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  
                  <Skeleton className="h-4 w-28" />
                </div>
                {index === 0 && <Skeleton className="h-5 w-14 rounded-md" />}
              </div>

              <div className="space-y-2 text-sm">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
  }

  return (
    <div className="max-w-4xl p-4">
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product History</h2>
          <p className="text-gray-600 mt-1">Track all changes and transfers for Product ID: {productId.productId}</p>
        </div>
        <Badge variant="default" className="px-3 py-1">
          {productHistory.length} Records
        </Badge>
      </div>

        <div className='relative'>
        <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-gray-200"></div>

      <div className="space-y-3">
        {productHistory.map((item, index) => (

            
          <Card key={item.id} className="p-4">
            
            <CardContent className="p-0">
              <div className="flex justify-between items-start mb-2">
                <div className="text-sm text-gray-600 flex items-center space-x-3">
                   
                    <CalendarDays className="w-4 h-4" />
                  <span>{format(item.timestamp)}</span>
                </div>
                {index === 0 && <Badge>Latest</Badge>}
              </div>
              
              <div className="space-y-1 text-sm">

                {item.new_employee_id?(
                    <div>
                    <span className="text-gray-600">Employee:</span> Reassign Product from <span className='font-semibold'>{item.previous_employee_name}</span> → <span className='font-semibold'>{item.new_employee_name}</span>
                    </div>

                ): item.previous_employee_id?(
                    <div>
                    <span className="text-gray-600">Employee:</span> Reassign Product from <span className='font-semibold'>{item.previous_employee_name}</span> → <span className='font-semibold'>unassigned</span>
                    </div>
                ):null}

                {item.new_location_id ? (
                    <div>
                        <span className="text-gray-600">Location:</span>{" "}
                        Transfer from Location{" "}
                        <span className="font-semibold">{item.previous_location_name}</span> →{" "}
                        <span className="font-semibold">{item.new_location_name}</span>
                    </div>
                    ) : null}

                <div>
                  <span className="text-gray-600">Changed By:</span> {item.changed_by}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
        </div>


    </div>
  );
};

export default ProductHistory;