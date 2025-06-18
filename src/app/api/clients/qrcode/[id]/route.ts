import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { generateQRCodeDataURL } from '@/lib/utils/qrcode';
import { getClientById, updateClient } from '@/lib/db/api/clientApi';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const clientId = params.id;
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }
    
    // Get client from database
    const client = await getClientById(clientId);
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    // Check if client already has a QR code ID
    // If not, we'll use their clientId as the QR code ID
    const qrCodeId = client.qrCodeId || client.clientId;
    
    // Generate QR code
    const qrCodeDataUrl = await generateQRCodeDataURL(qrCodeId);
    
    // If client doesn't have a QR code ID, update the client record
    if (!client.qrCodeId) {
      await updateClient(clientId, {
        qrCodeId: qrCodeId,
        qrCodeUrl: `/api/clients/qrcode/${clientId}`
      });
    }
    
    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataUrl,
      clientId: client.clientId,
      qrCodeId: qrCodeId
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

// POST endpoint to regenerate a QR code (if needed)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    // Check authentication - only admins can regenerate QR codes
    if (!session || session.user.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const clientId = params.id;
    
    if (!clientId) {
      return NextResponse.json(
        { error: 'Client ID is required' },
        { status: 400 }
      );
    }
    
    // Get client from database
    const client = await getClientById(clientId);
    
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }
    
    // Generate a new QR code ID
    const newQrCodeId = `${client.clientId}-${Date.now()}`;
    
    // Generate QR code
    const qrCodeDataUrl = await generateQRCodeDataURL(newQrCodeId);
    
    // Update the client record with the new QR code ID
    await updateClient(clientId, {
      qrCodeId: newQrCodeId,
      qrCodeUrl: `/api/clients/qrcode/${clientId}`
    });
    
    return NextResponse.json({
      success: true,
      qrCode: qrCodeDataUrl,
      clientId: client.clientId,
      qrCodeId: newQrCodeId
    });
  } catch (error) {
    console.error('Error regenerating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate QR code' },
      { status: 500 }
    );
  }
} 