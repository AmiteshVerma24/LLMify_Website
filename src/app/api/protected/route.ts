import { getServerSession } from 'next-auth';
import { DefaultSession } from 'next-auth';
import { NextResponse } from 'next/server';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string | null;
    } & DefaultSession['user'];
  }
}

export async function GET(request: Request) {
  // CORS Headers - allow the extension to access this endpoint
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  // Handle preflight OPTIONS request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers });
  }

  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401, headers }
    );
  }

  try {
    // Example: Fetch data that is specific to the logged-in user
    const userData = {
      message: `Hello, ${session?.user?.name}! This is protected data.`,
      userId: session?.user?.id,
      email: session?.user?.email,
      image: session?.user?.image,
      name: session?.user?.name,
  
    }; 
    
    return NextResponse.json(userData, { 
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error fetching protected data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch protected data' }, 
      { status: 500, headers }
    );
  }
}