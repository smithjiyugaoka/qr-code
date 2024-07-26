import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { getAuthSession } from '@/lib/auth';

export async function POST(req: Request) {
  const session = await getAuthSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { businessName } = await req.json();

  if (!businessName) {
    return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
  }

  try {
    const reviewUrl = `https://g.page/r/${encodeURIComponent(businessName)}/review`;
    const qrCodeDataUrl = await QRCode.toDataURL(reviewUrl);

    // Here you would typically save the QR code information to your database
    // For now, we'll just return the QR code image

    return NextResponse.json({ qrCodeUrl: qrCodeDataUrl });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json({ error: 'Failed to generate QR code' }, { status: 500 });
  }
}