"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import Input from "../../ui/input";
import { Button } from "../../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await axios.post(`${apiUrl}/auth/login`, data);

            if (response.status === 200) {
                if (typeof window !== "undefined") {
                    localStorage.setItem("token", response.data.data.token);

                    const base64Url = response.data.data.token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(
                        atob(base64)
                            .split('')
                            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                            .join('')
                    );

                    const userData = JSON.parse(jsonPayload);
                    localStorage.setItem("email", userData.sub);
                    localStorage.setItem("role", userData.role);
                    localStorage.setItem("UUID", userData.UUID);
                    localStorage.setItem("name", userData.name);
                    window.dispatchEvent(new Event("authChange"));
                }
                router.replace("/home");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(error.response?.data.message || "Login failed");
            } else {
                setErrorMessage("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3 max-w-xs w-full mx-auto"
        >
            <div>
                <label className="text-xs font-medium">Email</label>
                <Input
                    type="email"
                    {...register("email")}
                    className="mt-1 w-full text-xs"
                />
                {errors.email && (
                    <p className="text-danger text-xs mt-1">{errors.email.message}</p>
                )}
            </div>
            <div>
                <label className="text-xs font-medium">Password</label>
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        className="mt-1 pr-10 w-full text-xs"
                    />
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 px-3 text-accent text-xs"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-danger text-xs mt-1">{errors.password.message}</p>
                )}
            </div>
            {errorMessage && (
                <p className="text-danger text-xs text-center">{errorMessage}</p>
            )}
            <Button
                type="submit"
                className="w-full text-xs py-2"
                disabled={isLoading}
            >
                {isLoading ? "Loading..." : "Log In"}
            </Button>
            <div className="text-center mt-3">
                <Link
                    href="/reset-password"
                    className="text-accent hover:underline text-xs"
                >
                    Forgot your password?
                </Link>
            </div>
        </form>
    );
}