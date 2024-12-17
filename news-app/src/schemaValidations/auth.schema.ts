import z from 'zod'

export const LoginBody = z.object({
    username: z.string().trim().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
}).strict();

const RegisterBody = z.object({
    username: z.string().trim().min(2).max(256),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100)
}).strict().superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
        ctx.addIssue({
            code: 'custom',
            message: 'Passwords do not match',
            path: ['confirmPassword']
        })
    }
})

export type LoginBodyType = z.TypeOf<typeof LoginBody>
export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export type LoginResType = {
    access: string,
    refresh: string,
}