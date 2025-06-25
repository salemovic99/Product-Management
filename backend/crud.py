from sqlalchemy.orm import Session
from typing import List, Optional
import models
import schemas
from qr import create_qr_code_image, delete_qr_code_image
from fastapi import HTTPException
import os
import shutil

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

# Position CRUD operations
def create_position(db: Session, position: schemas.PositionCreate):
    db_position = models.Position(**position.model_dump())
    db.add(db_position)
    db.commit()
    db.refresh(db_position)
    return db_position

def get_position(db: Session, position_id: int):
    return db.query(models.Position).filter(models.Position.id == position_id).first()

def get_positions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Position).offset(skip).limit(limit).all()

def update_position(db: Session, position_id: int, position: schemas.PositionUpdate):
    db_position = db.query(models.Position).filter(models.Position.id == position_id).first()

    if not db_position:
        raise HTTPException(status_code=404, detail="Position not found")
    
    # Update position fields
    update_data = position.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_position, field, value)
    
    db.commit()
    db.refresh(db_position)
    return db_position

def delete_position(db: Session, position_id: int):
    db_position = db.query(models.Position).filter(models.Position.id == position_id).first()

    if not db_position:
        raise HTTPException(status_code=404, detail="Position not found")
    
    # Check if the position is referenced by any employees
    is_in_use = db.query(models.Employee).filter(models.Employee.position_id == position_id).first()
    if is_in_use:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete position {position_id}: it is still assigned to an employee."
        )
    
    db.delete(db_position)
    db.commit()
    return {"message": f"Position with ID {position_id} Deleted!"}



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
    return {"message": f"Employee with ID {unique_system_id} deleted successfully."}

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



    # Check if the serial number or our serial number is being updated
    if product.serial_number and db_product.serial_number != product.serial_number:
        existing_product = db.query(models.Product).filter(models.Product.serial_number == product.serial_number).first()
        if existing_product:
            raise HTTPException(status_code=400, detail="Serial number already exists for another product")

   
     # Determine what fields are being updated
    update_data = product.model_dump(exclude_unset=True)

    # If the product is being moved to a different location or assigned to an employee, update the history
    changes = {}

    if "employee_id" in update_data and db_product.employee_id != product.employee_id:
        changes["employee"] = (db_product.employee_id, product.employee_id)

    if "location_id" in update_data and db_product.location_id != product.location_id:
        changes["location"] = (db_product.location_id, product.location_id)


    
    # Update product fields
    update_data = product.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    db.commit()
    db.refresh(db_product)

    # Log to history if there were assignment changes
    if changes:
        history = schemas.ProductHistoryCreate(
            product_id=product_id,
            previous_employee_id=changes.get("employee", (None, None))[0],
            new_employee_id=changes.get("employee", (None, None))[1],
            previous_location_id=changes.get("location", (None, None))[0],
            new_location_id=changes.get("location", (None, None))[1],
            note = "note",
            changed_by="admin"  # You can customize this if you have auth
        )
        create_product_history(db, history)
        

      
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
    
    # Delete all files related to this product from the server
    files = get_product_files(product_id, db)
    if files:
        for file_record in files:
            file_path = file_record.file_path
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as e:
                print(f"Warning: Failed to delete file {file_path}. Reason: {e}")

     # ✅ Delete the product-specific folder
    product_folder_path = f"uploaded_files/product_{product_id}"
    try:
        if os.path.exists(product_folder_path):
            shutil.rmtree(product_folder_path)
    except Exception as e:
        print(f"Warning: Failed to delete folder {product_folder_path}. Reason: {e}")

    # Delete product from DB
    db.delete(db_product)
    db.commit()

    return {"message": f"Product with ID {product_id} deleted successfully."}

# def get_product_history(db: Session, product_id: int, skip: int = 0, limit: int = 100):
#     return db.query(models.ProductHistory).filter(models.ProductHistory.product_id == product_id).offset(skip).limit(limit).all()

def get_product_history(db: Session, product_id: int, skip: int = 0, limit: int = 100):
    # Order by timestamp descending to get most recent changes first
    return db.query(models.ProductHistory).filter(
        models.ProductHistory.product_id == product_id
    ).order_by(models.ProductHistory.timestamp.desc()).offset(skip).limit(limit).all()

def create_product_history(db: Session, product_history: schemas.ProductHistoryCreate):
    db_product_history = models.ProductHistory(**product_history.model_dump())
    db.add(db_product_history)
    db.commit()
    db.refresh(db_product_history)
    return db_product_history

def get_product_files(product_id: int, db: Session):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    files = db.query(models.ProductFile).filter(models.ProductFile.product_id == product_id).all()
    return files

def get_statuses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Status).offset(skip).limit(limit).all()