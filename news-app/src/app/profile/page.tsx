import envConfig from "@/config";
import { cookies } from 'next/headers';

export default async function ProfilePage() {

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('sessionToken')

    const result = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/users/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken.value}`,
        }
    }).then(async (res) => {
        const payload = await res.json();
        const data = {
            status: res.status,
            payload
        }
        if (!res.ok) throw data;
        return data;
    })

    return (
        <div>
            Profile page
        </div>
    )
}
