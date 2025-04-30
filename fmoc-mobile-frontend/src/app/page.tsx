"use client";
import axios from "axios";
import { useEffect, useState } from "react";

type UserData = {
	saldo: string | null;
};

export default function Home() {
	const [userData, setUserData] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const formatCurrency = (value: string | null) => {
        const number = Number(value);
        if (isNaN(number)) return "-";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

	useEffect(() => {
		const fetchData = async () => {
			try {
				const token = localStorage.getItem("token");
				if (!token) throw new Error("Token is missing");

				const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				});

				if (response.data.status !== 200) throw new Error("Failed to fetch user data");

				setUserData(response.data.data);
			} catch (err) {
				setError("Error fetching user data");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	if (loading) {
		return <div className="p-6 text-center">Loading...</div>;
	}

	if (!userData) {
		return <div className="p-6 text-center">Profile tidak ditemukan</div>;
	}

	return (
		<div className="p-4 flex flex-col md:p-7">
			<p className="text-xl text-gray-400 -mb-1">Saldo:</p>
			<h2 className="heading-5 text-neutral-700 font-bold">{formatCurrency(userData.saldo)}</h2>
		</div>
	);
}
