"use client";

import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRCodeScanner({ onScan }) {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null); // store scanner instance

  useEffect(() => {
    if (scanning && scannerRef.current && !scannerInstanceRef.current) {
      // Create scanner only once
      const html5QrCodeScanner = new Html5QrcodeScanner("qr-reader", {
        fps: 20,
        qrbox: 250,
      });

      html5QrCodeScanner.render(
        (decodedText) => {
          window.open(decodedText, "_blank");
          html5QrCodeScanner.clear();
          scannerInstanceRef.current = null;
          setScanning(false);
        },
        (errorMessage) => {
          console.log("QR Scan error:", errorMessage);
        }
      );

      scannerInstanceRef.current = html5QrCodeScanner;
    }

    return () => {
      if (scannerInstanceRef.current) {
        scannerInstanceRef.current.clear().catch((e) => console.error("Clear error", e));
        scannerInstanceRef.current = null;
      }
    };
  }, [scanning]);

  return (
    <div className="flex flex-col items-center gap-4">
      {!scanning ? (
        <button
          onClick={() => setScanning(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md shadow"
        >
          Scan QR Code
        </button>
      ) : (
        <div className="p-1  border-3 border-dashed border-purple-700 rounded-xl">
          <div id="qr-reader" ref={scannerRef} className="max-w-sm " />
        </div>
      )}
    </div>
  );
}
