import qrcode
import os
import uuid
from typing import Optional
from PIL import Image
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import RadialGradiantColorMask
import asyncio

# Create QR codes directory if it doesn't exist
QR_CODES_DIR = "qr_codes"
os.makedirs(QR_CODES_DIR, exist_ok=True)

def create_qr_code_image(product_url: str, logo_path: str = "logo/favicon.ico") -> str:

    if not product_url:
        raise ValueError("Product URL data cannot be empty")

    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(product_url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white").convert("RGBA")

    if logo_path and os.path.exists(logo_path):
        logo = Image.open(logo_path)
        qr_width, qr_height = img.size
        logo_size = min(qr_width, qr_height) // 5
        logo.thumbnail((logo_size, logo_size), Image.Resampling.LANCZOS)

        pos = ((qr_width - logo_size) // 2, (qr_height - logo_size) // 2)
        img.paste(logo, pos, logo if logo.mode == 'RGBA' else None)

    filename = f"product_{uuid.uuid4().hex}.png"
    filepath = os.path.join(QR_CODES_DIR, filename)
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
