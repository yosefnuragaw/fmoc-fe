"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { HiMiniHome, HiDocumentPlus, HiMiniUser } from "react-icons/hi2";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState<string | null>(null);

    const pathname = usePathname();
    const router = useRouter();

    const isLoginPage = pathname === "/login";
    const isResetPage = pathname === "/reset-password";

    useEffect(() => {
        setHasMounted(true);
        const token = localStorage.getItem("token");

        if (!token && !isLoginPage && !isResetPage) {
            router.push("/login");
        } else {
            setIsLoading(false);
            setUserName(localStorage.getItem("name"));
        }
    }, []);

    if (!hasMounted) return null;

    const menuItems = [
        { href: "/", icon: <HiMiniHome size={25} />, label: "Home" },
        { href: "/request", icon: <HiDocumentPlus size={25} />, label: "Create" },
        { href: "/profile", icon: <HiMiniUser size={25} />, label: "Profile" },
    ];

    return (
        <>
            {/* Upper Navbar */}
            {!isLoginPage && !isResetPage && (
                <div className="w-full fixed top-0 left-0 right-0 bg-white shadow z-30 flex justify-between items-center px-4 py-2 scrollbar-hide ">
                    <Image
                        src="/images/FMOC-logo.png"
                        alt="FMOC Logo"
                        width={80}
                        height={40}
                        className="object-contain"
                    />
                    <span className="text-xs font-medium text-neutral-700">
                        {userName || "User"}
                    </span>
                </div>
            )}

            {/* Main Content */}
            <div className={`min-h-screen scrollbar-hide ${!isLoginPage ? "pt-11 pb-10" : ""}`}>
                <main className={`${!isLoginPage ? "flex-grow p-4" : ""}`}>{children}</main>
            </div>


            {/* Bottom Navbar*/}
            {!isLoginPage && !isResetPage && (
                <div className="fixed bottom-0 left-0 right-0 z-30 bg-indigo-50 border-t border-gray-300 flex justify-around py-1 px-2 shadow-inner scrollbar-hide ">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <button
                                key={item.href}
                                onClick={() => router.push(item.href)}
                                className={`flex flex-col items-center px-3 py-1 rounded-full transition
                                    ${isActive ? "text-approved bg-approved-base" : "text-neutral-400"
                                    }`}
                            >
                                {item.icon}
                            </button>
                        );
                    })}
                </div>
            )}
        </>
    );
}