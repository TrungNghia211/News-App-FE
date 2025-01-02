'use client'

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import http from "@/lib/http";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { useRouter } from "next/navigation";
import jwt from 'jsonwebtoken';
import { useContext } from "react";
import { UserContext } from "@/app/AppProvider";
import Link from "next/link";

const formSchema = z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
})

export default function LoginForm() {

    const router = useRouter();
    const { setUser } = useContext(UserContext);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })

    async function onSubmit(values: any) {
        try {
            const result = await http.post<LoginResType>('/api/token/', JSON.stringify(values));
            const resultFromNextServer = await http.post<any>('/api/auth', JSON.stringify(result), { baseUrl: '' });
            const sessionToken = resultFromNextServer.payload.res.payload.access;
            const decoded = jwt.decode(sessionToken);
            const response = await http.get<any>(`/api/users/${decoded.user_id}/`);
            setUser(response.payload);
            router.push('/');
        } catch (error) {
            if (error.status === 401) {
                form.setError('password', {
                    type: 'server',
                    message: 'Email or password is incorrect !'
                });
                form.setError('username', {
                    type: 'server',
                    message: 'Email or password is incorrect !'
                });
            }
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 max-w-[450px] w-full">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your username" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter your password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <Link href="/register" className="underline">Đăng ký tài khoản mới</Link>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                />
                <Button className="!mt-[17px] w-full" type="submit">Login</Button>
            </form>
        </Form>
    )
}