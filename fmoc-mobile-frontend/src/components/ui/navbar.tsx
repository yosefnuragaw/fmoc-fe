"use client";

import { useEffect, useState } from "react";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    
    const getUser = () => {
      const storedUser = localStorage.getItem("name");
      setUser(storedUser ? { name: storedUser } : { name: "Guest" });
    };

    getUser();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "name") {
        getUser();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("logoutEvent", getUser);
    window.addEventListener("authChange", getUser);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("logoutEvent", getUser);
      window.removeEventListener("authChange", getUser);
    };
  }, []);

  if (!hasMounted) {
    return null;
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
