import qrcode
import os
import json
import uuid
from typing import Optional
from PIL import Image, ImageDraw
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import RadialGradiantColorMask

# Create QR codes directory if it doesn't exist
QR_CODES_DIR = "qr_codes"
os.makedirs(QR_CODES_DIR, exist_ok=True)

def create_qr_code_image(product_url: str, logo_path: str = "logo/favicon.ico") -> str:
   
    if not product_url:
        raise ValueError("Product URL data cannot be empty")
   
    # Create QR code with higher error correction for logo overlay
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction for logo
        box_size=10,
        border=4,
    )
    qr.add_data(product_url)
    qr.make(fit=True)
   
    # Create image
    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        color_mask=RadialGradiantColorMask()
    )
    
    # Add logo if provided
    if logo_path and os.path.exists(logo_path):
        # Convert to RGBA if not already
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Open logo image
        logo = Image.open(logo_path)
        
        # Calculate logo size (about 20% of QR code size)
        qr_width, qr_height = img.size
        logo_size = min(qr_width, qr_height) // 5
        
        # Resize logo maintaining aspect ratio
        logo.thumbnail((logo_size, logo_size), Image.Resampling.LANCZOS)
        
        # Create a white background for the logo area
        logo_bg_size = logo_size + 20  # Add padding
        logo_bg = Image.new('RGBA', (logo_bg_size, logo_bg_size), (255, 255, 255, 10))
        
        # Center the logo on the white background
        logo_bg_pos = ((logo_bg_size - logo.size[0]) // 2, (logo_bg_size - logo.size[1]) // 2)
        logo_bg.paste(logo, logo_bg_pos, logo if logo.mode == 'RGBA' else None)
        
        # Calculate position to center the logo on QR code
        pos = ((qr_width - logo_bg_size) // 2, (qr_height - logo_bg_size) // 2)
        
        # Paste logo with background onto QR code
        img.paste(logo_bg, pos, logo_bg)
   
    # Generate a unique filename
    filename = f"product_{uuid.uuid4().hex}.png"
    filepath = os.path.join(QR_CODES_DIR, filename)
   
    # Save image
    img.save(filepath)
   
    return filepath

# def create_qr_code_image(product_url: str) -> str:
    
#     if not product_url:
#         raise ValueError("Product URL data cannot be empty")
    
#     # Create QR code
#     qr = qrcode.QRCode(
#         version=1,
#         error_correction=qrcode.constants.ERROR_CORRECT_L,
#         box_size=10,
#         border=4,
#     )
#     qr.add_data(product_url)
#     qr.make(fit=True)
    
#     # Create image
#     img = qr.make_image(
#         image_factory=StyledPilImage,
#         module_drawer=RoundedModuleDrawer(),
#         color_mask=RadialGradiantColorMask()
#     )
#     # Generate a unique filename
#     filename = f"product_{uuid.uuid4().hex}.png"
#     filepath = os.path.join(QR_CODES_DIR, filename)
    
#     # Save image
#     img.save(filepath)
    
#     return filepath

def delete_qr_code_image(qr_code_path: Optional[str]) -> bool:
    
    if qr_code_path and os.path.exists(qr_code_path):
        try:
            os.remove(qr_code_path)
            return True
        except Exception as e:
            print(f"Error deleting QR code file {qr_code_path}: {e}")
            return False
    return False

