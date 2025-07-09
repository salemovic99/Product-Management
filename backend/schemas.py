from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime

# Position Schemas
class PositionBase(BaseModel):
    name: str

class PositionCreate(PositionBase):
    pass

class PositionUpdate(BaseModel):
    name: Optional[str] = None

class Position(PositionBase):
    id: int
    
    class Config:
        from_attributes = True


# Location Schemas
class LocationBase(BaseModel):
    name: str
    google_map_link: Optional[str] = None

class LocationCreate(LocationBase):
    pass

class LocationUpdate(BaseModel):
    name: Optional[str] = None
    google_map_link: Optional[str] = None

class Location(LocationBase):
    id: int
    
    class Config:
        from_attributes = True

# Employee Schemas
class EmployeeBase(BaseModel):
    name: str
    employee_id: int = Field(..., ge=1, le=2147483647) 
    phone_number: Optional[str] = None
    position_id: int

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    employee_id: Optional[int] = None
    phone_number: Optional[str] = None
    position_id: Optional[int] = None

class Employee(EmployeeBase):
    id: int
    position: Optional[Position] = None
    
    class Config:
        from_attributes = True

class Status(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    name: str
    serial_number: str
    our_serial_number: str
    location_id: int
    employee_id: Optional[int]
    in_warehouse: bool = True
    purchasing_date: Optional[date] = None
    warranty_expire: Optional[date] = None
    note: Optional[str] = None
    dynamic_qr_code: Optional[str] = None
    status_id: Optional[int]

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    serial_number: Optional[str] = None
    our_serial_number: Optional[str] = None
    location_id: Optional[int] = None
    employee_id: Optional[int] = None
    in_warehouse: Optional[bool] = None
    purchasing_date: Optional[date] = None
    warranty_expire: Optional[date] = None
    note: Optional[str] = None
    dynamic_qr_code: Optional[str] = None
    status_id: Optional[int]=None
    changed_by: Optional[str]=None

class Product(ProductBase):
    id: int
    location: Optional[Location] = None
    employee: Optional[Employee] = None
    status: Optional[Status] = None
    
    class Config:
        from_attributes = True




# Extended schemas with relationships
class LocationWithProducts(Location):
    products: List[Product] = []

class EmployeeWithProducts(Employee):
    products: List[Product] = []

class PositionWithEmployees(Position):
    employees: List[Employee] = []



class ProductHistoryBase(BaseModel):
    product_id: int
    previous_employee_id: Optional[int] = None
    new_employee_id: Optional[int] = None
    previous_location_id: Optional[int] = None
    new_location_id: Optional[int] = None
    note: Optional[str] = None
    changed_by: Optional[str] = None

class ProductHistoryCreate(ProductHistoryBase):
    pass

class ProductHistoryUpdate(BaseModel):
    previous_employee_id: Optional[int] = None
    new_employee_id: Optional[int] = None
    previous_location_id: Optional[int] = None
    new_location_id: Optional[int] = None
    note: Optional[str] = None
    changed_by: Optional[str] = None



class ProductHistory(ProductHistoryBase):
    id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True


class ProductFileOut(BaseModel):
    id: int
    file_path: str
    uploaded_at: datetime

    class Config:
        orm_mode = True

class ProductFile(BaseModel):
    id: int
    product_id: int
    file_path: str
    uploaded_at: datetime

    class Config:
        from_attributes = True