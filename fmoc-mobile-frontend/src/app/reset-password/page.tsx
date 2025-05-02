"use client";
import ResetPasswordForm from "../../components/modules/auth/reset-password";

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-xs bg-white p-6 rounded-lg shadow-md">
                <h2 className="heading-5 font-bold text-primary text-center mb-6">
                    Reset Password
                </h2>
                <ResetPasswordForm />
            </div>
        </div>
    );
}
