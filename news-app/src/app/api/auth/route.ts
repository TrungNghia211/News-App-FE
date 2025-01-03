export async function POST(request: Request) {
    const res = await request.json();
    const sessionToken = res.payload?.access;
    const refreshToken = res.payload?.refresh;
    if (!sessionToken)
        return Response.json({ message: 'Can not receive session token' }, { status: 400 })
    const headers = new Headers();
    headers.append('Set-Cookie', `sessionToken=${sessionToken}; Path=/; HttpOnly`);
    if (refreshToken) {
        headers.append('Set-Cookie', `refreshToken=${refreshToken}; Path=/; HttpOnly`);
    }

    return Response.json({ res }, {
        status: 200,
        headers
    })
}