import RegisterForm from "@/app/components/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center">
            <h1 className="text-xl font-semibold text-center">Đăng ký</h1>
            <RegisterForm />
        </div>
    )
}