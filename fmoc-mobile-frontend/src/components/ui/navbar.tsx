"use client";

import { useEffect, useState } from "react";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [hasMounted, setHasMounted] = useState(false); // Cegah SSR error

  useEffect(() => {
    setHasMounted(true); // Menandai bahwa komponen sudah di-mount di client
    
    const getUser = () => {
      const storedUser = localStorage.getItem("name");
      setUser(storedUser ? { name: storedUser } : { name: "Guest" });
    };

    getUser(); // Ambil data user pertama kali

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "name") {
        getUser(); // Update state saat `name` berubah di localStorage
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("logoutEvent", getUser); // Tambahkan listener logout
    window.addEventListener("authChange", getUser); 

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("logoutEvent", getUser);
      window.removeEventListener("authChange", getUser); 
    };
  }, []);

  if (!hasMounted) {
    return null; // Mencegah render SSR yang berbeda dengan client
  }

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="flex items-center justify-between">
        {/* Toggle Sidebar */}
        <button onClick={toggleSidebar} className="p-2 text-accent">
          ☰
        </button>

        {/* Nama User */}
        <span className="text-gray-700 font-medium">
          {user ? user.name : "Loading..."}
        </span>
      </div>
    </nav>
  );
}
