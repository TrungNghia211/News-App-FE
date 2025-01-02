import { cookies } from 'next/headers';

export async function POST() {
    const cookieStore = cookies();
    cookieStore.delete('sessionToken');
    cookieStore.delete('refreshToken');
    return Response.json({ message: 'Logged out successfully' }, { status: 200 })
}

