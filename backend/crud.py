from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas
from qr import create_qr_code_image, delete_qr_code_image
from fastapi import HTTPException

# Location CRUD operations
def create_location(db: Session, location: schemas.LocationCreate):
    db_location = models.Location(**location.model_dump())
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location

def get_location(db: Session, location_id: int):
    return db.query(models.Location).filter(models.Location.id == location_id).first()

def get_locations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Location).offset(skip).limit(limit).all()

def update_location(db: Session, location_id: int, location: schemas.LocationUpdate):
    db_location = db.query(models.Location).filter(models.Location.id == location_id).first()

    if db_location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    
    update_data = location.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_location, field, value)
        
    db.commit()
    db.refresh(db_location)
    return db_location

def delete_location(db: Session, location_id: int):
    db_location = db.query(models.Location).filter(models.Location.id == location_id).first()

    if  db_location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    
      # Check if any products are using this location
    in_use = db.query(models.Product).filter(models.Product.location_id == location_id).first()
    if in_use:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete location {location_id}: it is in use by one or more products."
        )
        
    db.delete(db_location)
    db.commit()
    return {"message": f"Location with ID {location_id} Deleted!"}

# Employee CRUD operations
def create_employee(db: Session, employee: schemas.EmployeeCreate):
    db_employee = models.Employee(**employee.model_dump())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def get_employee(db: Session, unique_system_id: int):
    return db.query(models.Employee).filter(models.Employee.id == unique_system_id).first()

def get_employee_by_employee_id(db: Session, employee_id: str):
    return db.query(models.Employee).filter(models.Employee.id == employee_id).first()

def get_employees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Employee).offset(skip).limit(limit).all()

def update_employee(db: Session, unique_system_id: int, employee: schemas.EmployeeUpdate):
    db_employee = db.query(models.Employee).filter(models.Employee.id == unique_system_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    # Update employee fields
    update_data = employee.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_employee, field, value)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, unique_system_id: int):
    db_employee = db.query(models.Employee).filter(models.Employee.id == unique_system_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail=f"Employee with ID {unique_system_id} not found")

        
    # Check if the employee is referenced in any products
    is_in_use = db.query(models.Product).filter(models.Product.employee_id == unique_system_id).first()

    if is_in_use:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete employee {unique_system_id}: They are still assigned to a product."
        )

    db.delete(db_employee)
    db.commit()
    return db_employee

# Product CRUD operations
def create_product(db: Session, product: schemas.ProductCreate):
    # Step 1: Create the product entry in the database
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    # Generate QR code after product is created (so we have the ID)
    product_url = f"http://localhost:3000/dashboard/products/details/{db_product.id}"

    # Create QR code and update the product with the path
    qr_code_path = create_qr_code_image(product_url)
    db_product.dynamic_qr_code = qr_code_path
    db.commit()
    db.refresh(db_product)
    
    return db_product

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_product_by_serial(db: Session, serial_number: str):
    return db.query(models.Product).filter(models.Product.serial_number == serial_number).first()

def get_product_by_our_serial(db: Session, our_serial_number: str):
    return db.query(models.Product).filter(models.Product.our_serial_number == our_serial_number).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def get_products_in_warehouse(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).filter(models.Product.in_warehouse == True).offset(skip).limit(limit).all()

def get_products_assigned_to_employees(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).filter(models.Product.in_warehouse == False).offset(skip).limit(limit).all()

def get_products_by_location(db: Session, location_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Product).filter(models.Product.location_id == location_id).offset(skip).limit(limit).all()

def get_products_by_employee(db: Session, employee_id: str, skip: int = 0, limit: int = 100):
    return db.query(models.Product).filter(models.Product.employee_id == employee_id).offset(skip).limit(limit).all()

def update_product(db: Session, product_id: int, product: schemas.ProductUpdate):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    
    # Update product fields
    update_data = product.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)
        
    return {"message" :f"product with ID {product_id} updated!"}

def delete_product(db: Session, product_id: int):
    # Fetch the product
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()

    # Handle not found
    if not db_product:
        raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")
    
    # Delete associated QR code file if exists
    if db_product.dynamic_qr_code:
        try:
            delete_qr_code_image(db_product.dynamic_qr_code)
        except Exception as e:
            # Optional: log or handle if file deletion fails
            print(f"Warning: Failed to delete QR code image. Reason: {e}")
    
    # Delete product from DB
    db.delete(db_product)
    db.commit()

    return {"message": f"Product with ID {product_id} deleted successfully."}