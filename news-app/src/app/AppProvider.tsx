'use client'

import { clientSessionToken } from "@/lib/http";
import { createContext, useEffect, useState } from "react";

interface User {
    id: number;
    email: string;
    username: string;
    phone: string;
    birthday: string;
    address: string;
    description: string;
    is_staff: boolean;
}

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => { },
});

export default function AppProvider({
    children,
    initialSessionToken = ''
}: {
    children: React.ReactNode
    initialSessionToken?: string
}) {

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = sessionStorage.getItem("user");
            if (storedUser)
                setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (user)
            sessionStorage.setItem("user", JSON.stringify(user));
        else
            sessionStorage.removeItem("user");
    }, [user]);

    useEffect(() => {
        if (typeof window !== 'undefined')
            clientSessionToken.value = initialSessionToken;
    }, [initialSessionToken]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext };
