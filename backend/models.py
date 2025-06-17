from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy import func

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    google_map_link = Column(Text)

    # Relationship to products
    products = relationship("Product", back_populates="location")

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    employee_id = Column(Integer, unique=True, nullable=False, index=True)
    phone_number = Column(String)

    # Relationship to products
    products = relationship("Product", back_populates="employee")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    serial_number = Column(String, unique=True, nullable=False, index=True)
    our_serial_number = Column(String, unique=True, nullable=False, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"))
    employee_id = Column(Integer, ForeignKey("employees.id"),nullable=True ,default=0)
    in_warehouse = Column(Boolean, default=True, nullable=False)
    purchasing_date = Column(Date)
    warranty_expire = Column(Date, server_default=func.now())
    note = Column(Text)
    dynamic_qr_code = Column(String)

    # Relationships
    location = relationship("Location", back_populates="products")
    employee = relationship("Employee", back_populates="products")