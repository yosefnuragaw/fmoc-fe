"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const resetPasswordSchema = z
    .object({
        email: z.string().email({ message: "Invalid email address" }),
        secretKey: z.string().min(1, { message: "Secret key is required" }),
        newPassword: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" }),
        confirmPassword: z
            .string()
            .min(8, { message: "Password must be at least 8 characters" }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export default function ResetPasswordForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(resetPasswordSchema),
    });

    const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
    const router = useRouter();

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch(`${apiUrl}/auth/reset-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: data.email,
                    newPassword: data.newPassword,
                    secretKey: data.secretKey,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(
                    `Failed to reset password: ${response.status} ${response.statusText} - ${errorText}`
                );
            }

            const result = await response.json();
            console.log("Password reset successful:", result);
            toast.info("Password reset successful");
            router.push("/login");
        } catch (error) {
            console.error("Error resetting password:", error);
            toast.error("Error resetting password");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 text-xs">
            <div>
                <label className="font-medium">Email</label>
                <Input
                    type="email"
                    {...register("email")}
                    className="mt-1 w-full text-xs"
                />
                {errors.email && (
                    <p className="text-danger mt-1">{errors.email.message}</p>
                )}
            </div>

            <div>
                <label className="font-medium">Secret Key</label>
                <Input
                    type="text"
                    {...register("secretKey")}
                    className="mt-1 w-full text-xs"
                />
                {errors.secretKey && (
                    <p className="text-danger mt-1">{errors.secretKey.message}</p>
                )}
            </div>

            <div>
                <label className="font-medium">New Password</label>
                <Input
                    type="password"
                    {...register("newPassword")}
                    className="mt-1 w-full text-xs"
                />
                {errors.newPassword && (
                    <p className="text-danger mt-1">{errors.newPassword.message}</p>
                )}
            </div>

            <div>
                <label className="font-medium">Confirm Password</label>
                <Input
                    type="password"
                    {...register("confirmPassword")}
                    className="mt-1 w-full text-xs"
                />
                {errors.confirmPassword && (
                    <p className="text-danger mt-1">{errors.confirmPassword.message}</p>
                )}
            </div>

            <Button type="submit" className="w-full text-xs py-2">
                Reset Password
            </Button>

            <div className="text-center mt-3">
                <Link href="/login" className="text-accent hover:underline text-xs">
                    Back to Login
                </Link>
            </div>
        </form>
    );
}
