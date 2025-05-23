// hooks/useAuth.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useAuth() {
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState<string | null>(null);

    const router = useRouter();
    const pathname = usePathname();

    const isLoginPage = pathname === "/login";
    const isResetPage = pathname === "/reset-password";

    useEffect(() => {
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("name");

        if (!token && !isLoginPage && !isResetPage) {
            router.replace("/login");
        } else {
            setUserName(name);
        }

        setIsLoading(false); // ✅ Always stop loading
    }, [isLoginPage, isResetPage, router]);

    const isAuthenticated = !!userName;

    return { isLoading, userName, isAuthenticated, isLoginPage, isResetPage };
}
