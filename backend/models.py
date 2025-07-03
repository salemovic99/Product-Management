from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)  # Specify length for PostgreSQL
    google_map_link = Column(Text)

    # Relationship to products
    products = relationship("Product", back_populates="location")

class Position(Base):
    __tablename__ = "positions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)

    # Relationship to employees
    employees = relationship("Employee", back_populates="position")

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    employee_id = Column(Integer, unique=True, nullable=False, index=True)  # Changed to String
    phone_number = Column(String(20))
    position_id = Column(Integer, ForeignKey("positions.id"), nullable=False)

    # Relationships
    products = relationship("Product", back_populates="employee")
    position = relationship("Position", back_populates="employees")

class Status(Base):
    __tablename__ = "statuses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)

    products = relationship("Product", back_populates="status")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    serial_number = Column(String(100), unique=True, nullable=False, index=True)
    our_serial_number = Column(String(100), unique=True, nullable=False, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"))
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True, default=None) 
    in_warehouse = Column(Boolean, default=True, nullable=False)
    purchasing_date = Column(Date)
    warranty_expire = Column(Date, nullable=True, default=None)
    note = Column(Text)
    dynamic_qr_code = Column(String(500))
    status_id = Column(Integer, ForeignKey("statuses.id"))

    # Relationships
    location = relationship("Location", back_populates="products")
    employee = relationship("Employee", back_populates="products")
    history_entries = relationship("ProductHistory", back_populates="product", cascade="all, delete-orphan")
    files = relationship("ProductFile", back_populates="product", cascade="all, delete")
    status = relationship("Status", back_populates="products")

class ProductHistory(Base):
    __tablename__ = "product_history"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    previous_employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    new_employee_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    previous_location_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    new_location_id = Column(Integer, ForeignKey("locations.id"), nullable=True)
    changed_by = Column(String(100), nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())  # PostgreSQL timezone support
    note = Column(Text, nullable=True)

    product = relationship("Product", back_populates="history_entries")

class ProductFile(Base):
    __tablename__ = "product_files"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    file_path = Column(String(500), nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    product = relationship("Product", back_populates="files")