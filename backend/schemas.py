from pydantic import BaseModel
from typing import Optional, List
from datetime import date

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
    employee_id: int
    phone_number: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(BaseModel):
    name: Optional[str] = None
    employee_id: Optional[int] = None
    phone_number: Optional[str] = None

class Employee(EmployeeBase):
    id: int
    
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

class Product(ProductBase):
    id: int
    location: Optional[Location] = None
    employee: Optional[Employee] = None
    
    class Config:
        from_attributes = True

# Extended schemas with relationships
class LocationWithProducts(Location):
    products: List[Product] = []

class EmployeeWithProducts(Employee):
    products: List[Product] = []