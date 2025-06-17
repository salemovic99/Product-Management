import qrcode
import os
import json
import uuid
from typing import Optional
from PIL import Image
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import RadialGradiantColorMask

# Create QR codes directory if it doesn't exist
QR_CODES_DIR = "qr_codes"
os.makedirs(QR_CODES_DIR, exist_ok=True)


def create_qr_code_image(product_url: str) -> str:
    
    if not product_url:
        raise ValueError("Product URL data cannot be empty")
    
    # Create QR code
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
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
    # Generate a unique filename
    filename = f"product_{uuid.uuid4().hex}.png"
    filepath = os.path.join(QR_CODES_DIR, filename)
    
    # Save image
    img.save(filepath)
    
    return filepath

def delete_qr_code_image(qr_code_path: Optional[str]) -> bool:
    
    if qr_code_path and os.path.exists(qr_code_path):
        try:
            os.remove(qr_code_path)
            return True
        except Exception as e:
            print(f"Error deleting QR code file {qr_code_path}: {e}")
            return False
    return False

