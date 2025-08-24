import { getServerSession } from 'next-auth';
import { DefaultSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { cookies } from 'next/headers'


declare module 'next-auth' {
  interface Session {
    user: {
      id?: string | null;
    } & DefaultSession['user'];
    accessToken?: string | null;
    refreshToken?: string | null;
    provider?: string | null;
    providerId?: string | null;
  }
}

export async function GET(request: Request) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers });
  }

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' }, 
      { status: 401, headers }
    );
  }
  try {
    const cookieStore = cookies();
    const backendAccessToken = (await cookieStore).get('accessToken')?.value || null;
    const backendRefreshToken = (await cookieStore).get('refreshToken')?.value || null;

    const userData = {
      message: `Hello, ${session?.user?.name}! This is protected data.`,
      userId: session?.user?.id,
      email: session?.user?.email,
      image: session?.user?.image,
      name: session?.user?.name,
      accessToken: session?.accessToken,
      refreshToken: session?.refreshToken,
      provider: session?.provider,
      providerId: session?.providerId,
      backendAccessToken: backendAccessToken,
      backendRefreshToken: backendRefreshToken,
    };

    console.log('Protected data fetched successfully:', userData);
    
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