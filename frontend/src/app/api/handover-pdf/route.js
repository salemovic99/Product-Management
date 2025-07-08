import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';;
import { HandoverPDF } from '@/components/HandoverPDF';

export async function POST(req) {
  try {
    const data = await req.json();
  
    if(!data){
      throw new Error("request data is null!");
    }

    const buffer = await renderToBuffer(<HandoverPDF data={data} />);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="handover.pdf"',
      },
    });
    
  } catch (error) {
    throw new Error(error.message)
  }
}
