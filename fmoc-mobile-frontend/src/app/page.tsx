"use client";

import withAuth from "@/components/modules/auth/withauth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Home() {
	const router = useRouter();

	useEffect(() => {
		router.replace("/home");
	}, [router]);

	return null;
}

export default withAuth(Home, ["FE"]);