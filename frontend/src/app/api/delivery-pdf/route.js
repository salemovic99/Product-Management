import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { DeliveryPDF } from '../../../components/DeliveryPDF';

export async function POST(req) {
  const data = await req.json();
  const buffer = await renderToBuffer(<DeliveryPDF data={data} />);

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="delivery.pdf"',
    },
  });
}
