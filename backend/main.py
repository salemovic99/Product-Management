from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, select
from typing import List
import models
import schemas
import crud
from database import get_db, create_tables, AsyncSessionLocal
import os
from qr import QR_CODES_DIR
from fastapi.middleware.cors import CORSMiddleware
import shutil
from seed_data import seed_statuses

# Create QR codes directory if it doesn't exist
os.makedirs(QR_CODES_DIR, exist_ok=True)

app = FastAPI(
    title="Stock Controller System",
    description="A comprehensive system for managing equipment, locations, and employee assignments",
    version="1.0.0"
)

# Enable CORS for all origins (dev mode)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount static files to serve QR code images
app.mount("/qr_codes", StaticFiles(directory="qr_codes"), name="qr_codes")
app.mount("/uploaded_files", StaticFiles(directory="uploaded_files"), name="uploaded_files")

@app.on_event("startup")
async def startup_event():
    # Create database tables
    await create_tables()
    # Seed initial data
    async with AsyncSessionLocal() as session:
        await seed_statuses(session)

@app.get("/statuses/", response_model=List[schemas.Status])
async def get_statuses(db: AsyncSession = Depends(get_db)):
    statuses = await crud.get_statuses(db)
    return statuses

# Uploaded files
@app.post("/products/{product_id}/upload")
async def upload_product_file(
    product_id: int,
    files: List[UploadFile] = File(...),
    db: AsyncSession = Depends(get_db)
):
    # Ensure the product exists
    product = await crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Create folder for product files
    folder = os.path.join("uploaded_files", f"product_{product_id}")
    os.makedirs(folder, exist_ok=True)

    saved_files = []

    for file in files:
        file_path = os.path.join(folder, file.filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        db_file = models.ProductFile(product_id=product_id, file_path=file_path)
        db.add(db_file)
        saved_files.append(db_file)

    await db.commit()

    return {"message": "Files uploaded", "files": [f.file_path for f in saved_files]}

@app.get("/products/{product_id}/files", response_model=List[schemas.ProductFile])
async def get_product_files(product_id: int, db: AsyncSession = Depends(get_db)):
    files = await crud.get_product_files(product_id, db)
    return files

# Location endpoints
@app.post("/locations/", response_model=schemas.Location)
async def create_location(location: schemas.LocationCreate, db: AsyncSession = Depends(get_db)):
    return await crud.create_location(db=db, location=location)

@app.get("/locations/count", response_model=dict)
async def get_locations_count(db: AsyncSession = Depends(get_db)):
    result = await db.execute(func.count(models.Location.id))
    count = result.scalar()
    return {"count": count}

@app.get("/locations/", response_model=List[schemas.Location])
async def read_locations(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    locations = await crud.get_locations(db, skip=skip, limit=limit)
    return locations

@app.get("/locations/{location_id}", response_model=schemas.Location)
async def read_location(location_id: int, db: AsyncSession = Depends(get_db)):
    db_location = await crud.get_location(db, location_id=location_id)
    if db_location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return db_location

@app.put("/locations/{location_id}", response_model=schemas.Location)
async def update_location(location_id: int, location: schemas.LocationUpdate, db: AsyncSession = Depends(get_db)):
    db_location = await crud.update_location(db, location_id=location_id, location=location)
    if db_location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return db_location

@app.delete("/locations/{location_id}", response_model=dict)
async def delete_location(location_id: int, db: AsyncSession = Depends(get_db)):
    db_location = await crud.delete_location(db, location_id=location_id)
    return db_location

# Employee endpoints
@app.post("/employees/", response_model=schemas.Employee)
async def create_employee(employee: schemas.EmployeeCreate, db: AsyncSession = Depends(get_db)):
    db_employee = await crud.get_employee_by_employee_id(db, employee_id=employee.employee_id)
    if db_employee:
        raise HTTPException(status_code=400, detail="Employee ID already registered")
    return await crud.create_employee(db=db, employee=employee)

@app.get("/employees/count", response_model=dict)
async def get_employees_count(db: AsyncSession = Depends(get_db)):
    result = await db.execute(func.count(models.Employee.id))
    count = result.scalar()
    return {"count": count}

@app.get("/employees/", response_model=List[schemas.Employee])
async def read_employees(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    employees = await crud.get_employees(db, skip=skip, limit=limit)
    return employees

@app.get("/employees/{unique_system_id}", response_model=schemas.Employee)
async def read_employee(unique_system_id: int, db: AsyncSession = Depends(get_db)):
    db_employee = await crud.get_employee(db, unique_system_id=unique_system_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

@app.get("/employees/by-employee-id/{employee_id}", response_model=schemas.Employee)
async def read_employee_by_employee_id(employee_id: int, db: AsyncSession = Depends(get_db)):
    db_employee = await crud.get_employee_by_employee_id(db, employee_id=employee_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee


@app.put("/employees/{unique_system_id}", response_model=schemas.Employee)
async def update_employee(unique_system_id: int, employee: schemas.EmployeeUpdate, db: AsyncSession= Depends(get_db)):
    db_employee = await crud.update_employee(db, unique_system_id=unique_system_id, employee=employee)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

@app.delete("/employees/{unique_system_id}", response_model=dict)
async def delete_employee(unique_system_id: int, db: AsyncSession= Depends(get_db)):
    db_employee = await crud.delete_employee(db, unique_system_id=unique_system_id)
    if db_employee is None:
        raise HTTPException(status_code=404, detail="Employee not found")
    return db_employee

# Product endpoints
@app.post("/products/", response_model=dict)
async def create_product(product: schemas.ProductCreate, db: AsyncSession= Depends(get_db)):
    # Check if location exists
    db_location = await crud.get_location(db, location_id=product.location_id)
    if not db_location:
        raise HTTPException(status_code=400, detail="Location not found")
    
    # Check if employee exists (if provided)
    if product.employee_id is not None:
        db_employee = await crud.get_employee(db, unique_system_id=product.employee_id)
        if not db_employee:
            raise HTTPException(status_code=400, detail="Employee not found")
    
    # Check for duplicate serial numbers
    db_product_serial = await crud.get_product_by_serial(db, serial_number=product.serial_number)
    if db_product_serial:
        raise HTTPException(status_code=400, detail="Serial number already registered")
    
    db_product_our_serial = await crud.get_product_by_our_serial(db, our_serial_number=product.our_serial_number)
    if db_product_our_serial:
        raise HTTPException(status_code=400, detail="Our serial number already registered")
    
    return await crud.create_product(db=db, product=product)


@app.get("/products/count", response_model=dict)
async def get_product_count(db: AsyncSession= Depends(get_db)):
    result = await db.execute(select(func.count(models.Product.id)))
    count = result.scalar()
    return {"count": count}

@app.get("/products/", response_model=List[schemas.Product])
async def read_products(skip: int = 0, limit: int = 100, db: AsyncSession= Depends(get_db)):
    products = await crud.get_products(db, skip=skip, limit=limit)
    return products

@app.get("/products/warehouse", response_model=List[schemas.Product])
async def read_products_in_warehouse(skip: int = 0, limit: int = 100, db: AsyncSession= Depends(get_db)):
    products = await crud.get_products_in_warehouse(db, skip=skip, limit=limit)
    return products

@app.get("/products/assigned", response_model=List[schemas.Product])
async def read_products_assigned_to_employees(skip: int = 0, limit: int = 100, db: AsyncSession= Depends(get_db)):
    products = await crud.get_products_assigned_to_employees(db, skip=skip, limit=limit)
    return products

@app.get("/products/location/{location_id}", response_model=List[schemas.Product])
async def read_products_by_location(location_id: int, skip: int = 0, limit: int = 100, db: AsyncSession= Depends(get_db)):
    products = await crud.get_products_by_location(db, location_id=location_id, skip=skip, limit=limit)
    return products

@app.get("/products/employee/{employee_id}", response_model=List[schemas.Product])
async def read_products_by_employee(employee_id: str, skip: int = 0, limit: int = 100, db: AsyncSession= Depends(get_db)):
    products = await crud.get_products_by_employee(db, employee_id=employee_id, skip=skip, limit=limit)
    return products

@app.get("/products/{product_id}", response_model=schemas.Product)
async def read_product(product_id: int, db: AsyncSession= Depends(get_db)):
    db_product = await crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.get("/products/serial/{serial_number}", response_model=schemas.Product)
async def read_product_by_serial(serial_number: str, db: AsyncSession= Depends(get_db)):
    db_product = await crud.get_product_by_serial(db, serial_number=serial_number)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.get("/products/our-serial/{our_serial_number}", response_model=schemas.Product)
async def read_product_by_our_serial(our_serial_number: str, db: AsyncSession= Depends(get_db)):
    db_product = await crud.get_product_by_our_serial(db, our_serial_number=our_serial_number)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@app.put("/products/{product_id}", response_model=dict)
async def update_product(product_id: int, product: schemas.ProductUpdate, db: AsyncSession= Depends(get_db)):
    # Validate location if provided
    if product.location_id is not None:
        db_location = await crud.get_location(db, location_id=product.location_id)
        if not db_location:
            raise HTTPException(status_code=400, detail="Location not found")
    
    # Validate employee if provided
    if product.employee_id is not None:
        db_employee = await crud.get_employee(db, unique_system_id=product.employee_id)
        if not db_employee:
            raise HTTPException(status_code=400, detail="Employee not found")
    
    db_product = await crud.update_product(db, product_id=product_id, product=product)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
        
    return db_product

@app.delete("/products/{product_id}", response_model=dict)
async def delete_product(product_id: int, db: AsyncSession= Depends(get_db)):
    db_product = await crud.delete_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

# Position endpoints
@app.post("/positions/", response_model=schemas.Position)
async def create_position(position: schemas.PositionCreate, db: AsyncSession= Depends(get_db)):
    return await crud.create_position(db=db, position=position)

@app.get("/positions/count", response_model=dict)
async def get_positions_count(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(func.count(models.Position.id)))
    count = result.scalar()
    return {"count": count}

@app.get("/positions/", response_model=List[schemas.Position])
async def read_positions(skip: int = 0, limit: int = 100, db: AsyncSession= Depends(get_db)):
    positions = await crud.get_positions(db, skip=skip, limit=limit)
    return positions

@app.get("/positions/{position_id}", response_model=schemas.Position)
async def read_position(position_id: int, db: AsyncSession= Depends(get_db)):
    db_position = await crud.get_position(db, position_id=position_id)
    if db_position is None:
        raise HTTPException(status_code=404, detail="Position not found")
    return db_position

@app.put("/positions/{position_id}", response_model=schemas.Position)
async def update_position(position_id: int, position: schemas.PositionUpdate, db: AsyncSession= Depends(get_db)):
    db_position =await crud.update_position(db, position_id=position_id, position=position)
    if db_position is None:
        raise HTTPException(status_code=404, detail="Position not found")
    return db_position

@app.delete("/positions/{position_id}", response_model=dict)
async def delete_position(position_id: int, db: AsyncSession= Depends(get_db)):
    db_position = await crud.delete_position(db, position_id=position_id)
    if db_position is None:
        raise HTTPException(status_code=404, detail="Position not found")
    return db_position

#end point for product history
@app.get("/products/{product_id}/history", response_model=List[schemas.ProductHistory])
async def get_product_history(product_id: int, db: AsyncSession= Depends(get_db)):
    history = await crud.get_product_history(db, product_id=product_id)
    if history is None:
        raise HTTPException(status_code=404, detail="Product history not found")
    return history



# Health check endpoint
@app.get("/")
async def read_root():
    return  {"message": " Stock Controller System API is running"}
