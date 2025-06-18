import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { searchClients } from '@/lib/db/api/clientApi';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Check authentication
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get search parameters
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');
    
    if (!email && !phone) {
      return NextResponse.json(
        { error: 'Email or phone parameter is required' },
        { status: 400 }
      );
    }
    
    // Search for clients
    let searchQuery = '';
    
    if (email) {
      searchQuery = email;
    } else if (phone) {
      searchQuery = phone;
    }
    
    const result = await searchClients(searchQuery, 1);
    
    if (result.clients.length === 0) {
      return NextResponse.json(
        { message: 'No clients found' },
        { status: 404 }
      );
    }
    
    // Return the first matching client
    const client = result.clients[0];
    
    return NextResponse.json({
      success: true,
      client: {
        id: client._id.toString(),
        name: `${client.firstName} ${client.lastName}`,
        email: client.email,
        phone: client.phoneNumber,
        clientId: client.clientId,
        visitCount: client.visitCount,
        rewardsEarned: client.rewardsEarned,
        rewardsRedeemed: client.rewardsRedeemed
      }
    });
  } catch (error) {
    console.error('Error searching for client:', error);
    return NextResponse.json(
      { error: 'Failed to search for client' },
      { status: 500 }
    );
  }
} 