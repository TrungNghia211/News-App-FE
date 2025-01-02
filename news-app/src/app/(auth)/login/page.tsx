import LoginForm from "@/app/components/AuthForms/LoginForm";

export default function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center">
            <h1 className="text-xl font-semibold text-center">Login</h1>
            <LoginForm />
        </div>
    )
}