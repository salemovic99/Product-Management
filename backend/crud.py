from operator import or_
from tokenize import String
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
import models
import schemas
from qr import create_qr_code_image, delete_qr_code_image
from fastapi import HTTPException, Query
import os
import shutil
import time
from sqlalchemy import String, func

# Location CRUD operations
async def create_location(db: AsyncSession, location: schemas.LocationCreate):
    db_location = models.Location(**location.model_dump())
    db.add(db_location)
    await db.commit()
    await db.refresh(db_location)
    return db_location

async def get_location(db: AsyncSession, location_id: int):
    result = await db.execute(select(models.Location).filter(models.Location.id == location_id))
    return result.scalars().first()

async def get_locations(db: AsyncSession, skip: int = 0, limit: int = 100, search: Optional[str] = Query(None)):
    query = select(models.Location)

    if search:
        query = query.where(
            models.Location.name.ilike(f"%{search}%")
        )

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

async def update_location(db: AsyncSession, location_id: int, location: schemas.LocationUpdate):
    result = await db.execute(select(models.Location).filter(models.Location.id == location_id))
    db_location = result.scalars().first()

    if db_location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    
    update_data = location.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_location, field, value)
        
    await db.commit()
    await db.refresh(db_location)
    return db_location

async def delete_location(db: AsyncSession, location_id: int):
    result = await db.execute(select(models.Location).filter(models.Location.id == location_id))
    db_location = result.scalars().first()

    if db_location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    
    # Check if any products are using this location
    products_result = await db.execute(select(models.Product).filter(models.Product.location_id == location_id))
    in_use = products_result.scalars().first()
    if in_use:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete  {db_location.name}: it is in use by one or more products."
        )

    # Check if the employee is referenced in product_history
    history_result = await db.execute(
        select(models.ProductHistory).filter(models.ProductHistory.previous_location_id == location_id)
    )
    has_history = history_result.scalars().first()

    if has_history:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete  {db_location.name}: They are referenced in product history."
        )
        
    await db.delete(db_location)
    await db.commit()
    return {"message": f"Location with ID {location_id} Deleted!"}

# Position CRUD operations
async def create_position(db: AsyncSession, position: schemas.PositionCreate):
    db_position = models.Position(**position.model_dump())
    db.add(db_position)
    await db.commit()
    await db.refresh(db_position)
    return db_position

async def get_position(db: AsyncSession, position_id: int):
    result = await db.execute(select(models.Position).filter(models.Position.id == position_id))
    return result.scalars().first()

async def get_positions(db: AsyncSession, skip: int = 0, limit: int = 100, search: Optional[str] = Query(None)):
    query = select(models.Position)

    if search:
        query = query.where(
            models.Position.name.ilike(f"%{search}%")
        )

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

async def update_position(db: AsyncSession, position_id: int, position: schemas.PositionUpdate):
    result = await db.execute(select(models.Position).filter(models.Position.id == position_id))
    db_position = result.scalars().first()

    if not db_position:
        raise HTTPException(status_code=404, detail="Position not found")
    
    update_data = position.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_position, field, value)
    
    await db.commit()
    await db.refresh(db_position)
    return db_position

async def delete_position(db: AsyncSession, position_id: int):
    result = await db.execute(select(models.Position).filter(models.Position.id == position_id))
    db_position = result.scalars().first()

    if not db_position:
        raise HTTPException(status_code=404, detail="Position not found")
    
    # Check if the position is referenced by any employees
    employees_result = await db.execute(select(models.Employee).filter(models.Employee.position_id == position_id))
    is_in_use = employees_result.scalars().first()
    if is_in_use:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete {db_position.name}: it is still assigned to an employee."
        )
    
    await db.delete(db_position)
    await db.commit()
    return {"message": f"Position with ID {position_id} Deleted!"}

# Employee CRUD operations
async def create_employee(db: AsyncSession, employee: schemas.EmployeeCreate):
    db_employee = models.Employee(**employee.model_dump())
    db.add(db_employee)
    await db.commit()
    
    result = await db.execute(
        select(models.Employee)
        .options(selectinload(models.Employee.position))
        .filter(models.Employee.id == db_employee.id)
    )
    return result.scalars().first()

async def get_employee(db: AsyncSession, unique_system_id: int):
    result = await db.execute(select(models.Employee).options(selectinload(models.Employee.position)).where(models.Employee.id == unique_system_id))
    return result.scalars().first()

async def get_employee_by_employee_id(db: AsyncSession, employee_id: int):
    result = await db.execute(select(models.Employee).options(selectinload(models.Employee.position)).filter(models.Employee.employee_id == employee_id))
    return result.scalars().first()

async def get_employees(db: AsyncSession, skip: int = 0, limit: int = 100, search: Optional[str] = Query(None)):
    query = select(models.Employee).options(selectinload(models.Employee.position))

    if search:
        query = query.where(
            models.Employee.name.ilike(f"%{search}%")
        )

    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

async def update_employee(db: AsyncSession, unique_system_id: int, employee: schemas.EmployeeUpdate):
    result = await db.execute(
        select(models.Employee)
        .options(selectinload(models.Employee.position))
        .filter(models.Employee.id == unique_system_id)
    )
    db_employee = result.scalars().first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    update_data = employee.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_employee, field, value)
    await db.commit()
    await db.refresh(db_employee)
    return db_employee

async def delete_employee(db: AsyncSession, unique_system_id: int):
    result = await db.execute(select(models.Employee).filter(models.Employee.id == unique_system_id))
    db_employee = result.scalars().first()
    if not db_employee:
        raise HTTPException(status_code=404, detail=f"Employee with ID {unique_system_id} not found")

    # Check if the employee is referenced in any products
    products_result = await db.execute(select(models.Product).filter(models.Product.employee_id == db_employee.id))
    is_in_use = products_result.scalars().first()

    if is_in_use:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete {db_employee.name}: They are still assigned to a product."
        )

     # Check if the employee is referenced in product_history
    history_result = await db.execute(
        select(models.ProductHistory).filter(models.ProductHistory.previous_employee_id == db_employee.id)
    )
    has_history = history_result.scalars().first()

    if has_history:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete {db_employee.name}: They are referenced in product history."
        )


    await db.delete(db_employee)
    await db.commit()
    return {"message": f"Employee with ID {unique_system_id} deleted successfully."}

# Product CRUD operations
async def create_product(db: AsyncSession, product: schemas.ProductCreate):
    start = time.time()#for debug
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    await db.flush()
    await db.refresh(db_product)
    
    BASE_FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Generate QR code after product is created
    product_url = f"{BASE_FRONTEND_URL}/dashboard/products/details/{db_product.id}"
    qr_code_path = create_qr_code_image(product_url)
    db_product.dynamic_qr_code = qr_code_path

    await db.commit()
   
    print("Create product took", time.time() - start)
    return { "details" :"product added successfully!"}

async def get_product(db: AsyncSession, product_id: int):
    result = await db.execute(
        select(models.Product)
        .options(
            selectinload(models.Product.status),
            selectinload(models.Product.employee).selectinload(models.Employee.position),
            selectinload(models.Product.location)
        )
        .filter(models.Product.id == product_id)
    )
    return result.scalars().first()

async def get_product_by_serial(db: AsyncSession, serial_number: str):
    result = await db.execute(select(models.Product).options(
            selectinload(models.Product.status),
            selectinload(models.Product.employee).selectinload(models.Employee.position),
            selectinload(models.Product.location)
        ).filter(models.Product.serial_number == serial_number))
    return result.scalars().first()

async def get_product_by_our_serial(db: AsyncSession, our_serial_number: str):
    result = await db.execute(select(models.Product).options(
            selectinload(models.Product.status),
            selectinload(models.Product.employee).selectinload(models.Employee.position),
            selectinload(models.Product.location)
        ).filter(models.Product.our_serial_number == our_serial_number))
    return result.scalars().first()

async def get_products(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 10,
    status: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    search:Optional[str] = Query(None)
):
    query = (
        select(models.Product)
        .options(
            selectinload(models.Product.status),
            selectinload(models.Product.employee).selectinload(models.Employee.position),
            selectinload(models.Product.location)
        )
        .select_from(models.Product)
    )

    # Apply filters if needed
    if status and status.lower() != "all":
        query = query.join(models.Status).where(models.Status.name.ilike(status))

    if location and location.lower() != "all":
        query = query.join(models.Location).where(models.Location.name.ilike(location))

    if search:
        query = query.filter(
            or_(
            or_(
                models.Product.name.ilike(f"%{search}%"),
                models.Product.serial_number.ilike(f"%{search}%")
            ),
            models.Product.id.cast(String).ilike(f"%{search}%")
        )
    )

    query = query.order_by(models.Product.id).offset(skip).limit(limit)

    result = await db.execute(query)
    return result.scalars().all()


async def get_products_in_warehouse_count(db):
    result = await db.execute(
        select(func.count(models.Product.id)).where(models.Product.in_warehouse == True)
    )
    return result.scalar()

async def get_products_in_warehouse(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(models.Product).options(
            selectinload(models.Product.status),
            selectinload(models.Product.employee).selectinload(models.Employee.position),
            selectinload(models.Product.location)
        ).filter(models.Product.in_warehouse == True).offset(skip).limit(limit))
    return result.scalars().all()

async def get_products_assigned_to_employees_count(db):
    result = await db.execute(
        select(func.count(models.Product.id)).where(models.Product.in_warehouse == False)
    )
    return result.scalar()

async def get_products_assigned_to_employees(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(models.Product).options(
            selectinload(models.Product.status),
            selectinload(models.Product.employee).selectinload(models.Employee.position),
            selectinload(models.Product.location)
        ).filter(models.Product.in_warehouse == False).offset(skip).limit(limit))
    return result.scalars().all()

async def get_products_by_location(db: AsyncSession, location_id: int, skip: int = 0, limit: int = 100):
    result = await db.execute(select(models.Product).options(
            selectinload(models.Product.status),
            selectinload(models.Product.employee).selectinload(models.Employee.position),
            selectinload(models.Product.location)
        ).filter(models.Product.location_id == location_id).offset(skip).limit(limit))
    return result.scalars().all()

async def get_products_by_employee(db: AsyncSession, employee_id: str, skip: int = 0, limit: int = 100):
    result = await db.execute(select(models.Product).options(
            selectinload(models.Product.status),
            selectinload(models.Product.employee).selectinload(models.Employee.position),
            selectinload(models.Product.location)
        ).filter(models.Product.employee_id == employee_id).offset(skip).limit(limit))
    return result.scalars().all()

async def update_product(db: AsyncSession, product_id: int, product: schemas.ProductUpdate):
    result = await db.execute(select(models.Product).filter(models.Product.id == product_id))
    db_product = result.scalars().first()

    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if the serial number is being updated and already exists
    if product.serial_number and db_product.serial_number != product.serial_number:
        existing_result = await db.execute(select(models.Product).filter(models.Product.serial_number == product.serial_number))
        existing_product = existing_result.scalars().first()
        if existing_product:
            raise HTTPException(status_code=400, detail="Serial number already exists for another product")

    # Track changes for history
    update_data = product.model_dump(exclude_unset=True)
    changes = {}

    if "employee_id" in update_data and db_product.employee_id != product.employee_id:
        changes["employee"] = (db_product.employee_id, product.employee_id)

    if "location_id" in update_data and db_product.location_id != product.location_id:
        changes["location"] = (db_product.location_id, product.location_id)

    # Update product fields
    for field, value in update_data.items():
        setattr(db_product, field, value)
    
    await db.commit()
    await db.refresh(db_product)

    # Log to history if there were assignment changes
    if changes:
        history = schemas.ProductHistoryCreate(
            product_id=product_id,
            previous_employee_id=changes.get("employee", (None, None))[0],
            new_employee_id=changes.get("employee", (None, None))[1],
            previous_location_id=changes.get("location", (None, None))[0],
            new_location_id=changes.get("location", (None, None))[1],
            note="Product updated",
            changed_by="admin"
        )
        await create_product_history(db, history)

    return {"message": f"Product with ID {product_id} updated!"}

async def delete_product(db: AsyncSession, product_id: int):
    result = await db.execute(select(models.Product).filter(models.Product.id == product_id))
    db_product = result.scalars().first()

    if not db_product:
        raise HTTPException(status_code=404, detail=f"Product with ID {product_id} not found")
    
    # Delete associated QR code file if exists
    if db_product.dynamic_qr_code:
        try:
            delete_qr_code_image(db_product.dynamic_qr_code)
        except Exception as e:
            print(f"Warning: Failed to delete QR code image. Reason: {e}")
    
    # Delete all files related to this product
    files = await get_product_files(product_id, db)
    if files:
        for file_record in files:
            file_path = file_record.file_path
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as e:
                print(f"Warning: Failed to delete file {file_path}. Reason: {e}")

    # Delete the product-specific folder
    product_folder_path = f"uploaded_files/product_{product_id}"
    try:
        if os.path.exists(product_folder_path):
            shutil.rmtree(product_folder_path)
    except Exception as e:
        print(f"Warning: Failed to delete folder {product_folder_path}. Reason: {e}")

    await db.delete(db_product)
    await db.commit()

    return {"message": f"Product with ID {product_id} deleted successfully."}

async def get_product_history(db: AsyncSession, product_id: int, skip: int = 0, limit: int = 100):
    result = await db.execute(
        select(models.ProductHistory)
        .filter(models.ProductHistory.product_id == product_id)
        .order_by(models.ProductHistory.timestamp.desc())
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

async def create_product_history(db: AsyncSession, product_history: schemas.ProductHistoryCreate):
    db_product_history = models.ProductHistory(**product_history.model_dump())
    db.add(db_product_history)
    await db.commit()
    await db.refresh(db_product_history)
    return db_product_history

async def get_product_files(product_id: int, db: AsyncSession):
    # Check if product exists
    product_result = await db.execute(select(models.Product).filter(models.Product.id == product_id))
    product = product_result.scalars().first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    files_result = await db.execute(select(models.ProductFile).filter(models.ProductFile.product_id == product_id))
    files = files_result.scalars().all()
    return files

async def get_statuses(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(models.Status).offset(skip).limit(limit))
    return result.scalars().all()