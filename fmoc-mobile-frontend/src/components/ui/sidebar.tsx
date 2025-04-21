"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Untuk Next.js App Router
import { useState } from "react";

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isSidebarOpen, toggleSidebar }: SidebarProps) {
  const router = useRouter();
  
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      // localStorage.removeItem("token");
      // localStorage.removeItem("user");
      // localStorage.removeItem("email");
      // localStorage.removeItem("name");
      // localStorage.removeItem("role");
      // localStorage.removeItem("UUID");
      // setIsApproveDialogOpen(false);
      // router.push("/login");
      window.dispatchEvent(new Event("logoutEvent"));
      
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 bg-white shadow-md w-64 z-10 transform transition-transform duration-200 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo dan Tombol Toggle */}
        <div className="flex items-center justify-between p-4 border-b">
          
            <Image
              src="/images/FMOC-logo.png"
              alt="FMOC Logo"
              width={240}
              height={80}
            />
          

        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center p-2 text-primary hover:bg-accent-base hover:text-accent rounded-lg transition duration-200"
              >
                <span>Dashboard</span>
              </Link>
            </li>
            {(localStorage.getItem("role") === "AF" || localStorage.getItem("role") === "PM") && (
              <li>
              <Link
                href="/users"
                className="flex items-center p-2 text-primary hover:bg-accent-base hover:text-accent rounded-lg transition duration-200"
              >
                <span>Users</span>
              </Link>
            </li>
            )}
            {!(localStorage.getItem("role") === "FE" || localStorage.getItem("role") === "BA") && (
            <li>
              <Link
                href="/requests"
                className="flex items-center p-2 text-primary hover:bg-accent-base hover:text-accent rounded-lg transition duration-200"
              >
                <span>Requests</span>
              </Link>
            </li>
            )}
            {!(localStorage.getItem("role") === "AF" || localStorage.getItem("role") === "PM" || localStorage.getItem("role") === "FE") && (
              <li>
              <Link
                href="/reimbursement"
                className="flex items-center p-2 text-primary hover:bg-accent-base hover:text-accent rounded-lg transition duration-200"
              >
                <span>Reimburse</span>
              </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Profile dan Logout */}
        <div className="p-4 border-t">
          <div className="flex flex-col space-y-2">
            <Link
              href="/profile"
              className="flex items-center p-2 text-primary hover:bg-accent-base hover:text-accent rounded-lg transition duration-200"
            >
              <span>Profile</span>
            </Link>
            <button
              className="flex items-center p-2 text-primary hover:bg-accent-base hover:text-accent rounded-lg transition duration-200"
              onClick={() => handleLogout()}
            >
              <span>Logout</span>
            </button>
          </div>
        </div>




      </div>
    </div>
  );


}