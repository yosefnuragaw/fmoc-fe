"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Bisa kasih role yang diizinkan, misal ["Admin", "PM"]
export default function withAuth(Component: React.ComponentType, allowedRoles: string[] = []) {
    return function AuthenticatedComponent(props: any) {
        const router = useRouter();
        const [isAuthorized, setIsAuthorized] = useState(false);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");

            if (!token) {
                toast.error("Silakan login terlebih dahulu.");
                router.replace("/login");
            } else if (allowedRoles.length && !allowedRoles.includes(role || "")) {
                toast.error("Akses ditolak: tidak memiliki izin.");
                router.replace("/unauthorized");
            } else {
                setIsAuthorized(true);
            }

            setLoading(false);
        }, []);

        if (loading) return <div className="text-center mt-10">Loading...</div>;

        if (!isAuthorized) return null;

        return <Component {...props} />;
    };
}