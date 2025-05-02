"use client";

import LoginForm from "@/components/modules/auth/login";

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="w-full max-w-xs bg-white p-6 rounded-lg shadow-md">
                <h2 className="heading-4 font-bold text-primary text-center mb-6">Log In</h2>
                <LoginForm />
            </div>
        </div>
    );
}
