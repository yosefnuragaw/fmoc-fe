"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import axios from "axios";
import { toast } from "sonner";

type Area = {
    subClusterName: string | null;
    clusterName: string | null;
    rmaName: string | null;
    operatorName: string | null;
};

type UserData = {
    name: string;
    role: string;
    email: string;
    area: Area;
    saldo: string | null;
    nomorRekening: string | null;
    nomorMobil: string | null;
    nomorGenset: string | null;
};

type Transaction = {
    time: string;
    type: string;
    nominal: number;
    wo: string;
};

const UserProfileComponent: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [activeTab, setActiveTab] = useState<'ringkasan' | 'riwayat'>('ringkasan');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const handleLogout = () => {
        try {
            localStorage.clear();
            toast.success("Berhasil logout");
            router.push("/login");
        } catch (error) {
            toast.error("Gagal logout");
        }
    };

    const formatArea = (area: Area | null) => {
        if (!area) return "-";
        const parts = [
            area.operatorName || "-",
            area.rmaName || "-",
            area.clusterName || "-",
            area.subClusterName || "-",
        ].filter((part) => part !== "-");
        return parts.length > 0 ? parts.join(" - ") : "-";
    };

    const formatCurrency = (value: string | null) => {
        const number = Number(value);
        if (isNaN(number)) return "-";
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    const formatValue = (value: string | null) => (value ? value : "-");

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

                const id = localStorage.getItem("UUID");
                const transactionResp = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/transactions`, {
                    params: { id: id },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log("hai: ", transactionResp.data);
                if (transactionResp.data.status != 200) throw new Error("Failed to fetch user transaction");

                setTransactions(transactionResp.data.data ?? []);
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
        <div className="rounded-md shadow-md overflow-hidden flex flex-col p-4 md:p-7 gap-6">
            {/* Header */}
            <div className="h-8 border-b-2 border-accent-base flex items-center pb-4">
                <h2 className="text-lg font-bold">Informasi Pengguna</h2>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b -mt-3">
                <button
                    className={`flex-1 py-1 text-xs font-medium ${activeTab === "ringkasan"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 border-b-2 border-transparent"
                        }`}
                    onClick={() => setActiveTab("ringkasan")}
                >
                    Ringkasan
                </button>
                <button
                    className={`flex-1 py-1 text-xs font-medium ${activeTab === "riwayat"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 border-b-2 border-transparent"
                        }`}
                    onClick={() => setActiveTab("riwayat")}
                >
                    Riwayat Transaksi
                </button>
            </div>

            {activeTab === 'ringkasan' ? (
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col gap-5 w-full md:w-1/2">
                        {[{ label: "Nama", value: userData.name },
                        { label: "Email", value: userData.email },
                        { label: "Area", value: formatArea(userData.area) }].map((item, index) => (
                            <div key={index} className="flex flex-col gap-1 w-full">
                                <div className="body-3 font-semibold">{item.label}</div>
                                <div className="px-2 py-2 bg-accent-base body-3 rounded">{item.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-5 w-full md:w-1/2">
                        {[{ label: "Saldo", value: formatCurrency(userData.saldo) },
                        { label: "Nomor Rekening", value: formatValue(userData.nomorRekening) },
                        { label: "Nomor Mobil", value: formatValue(userData.nomorMobil) },
                        { label: "Nomor Genset", value: formatValue(userData.nomorGenset) }].map((item, index) => (
                            <div key={index} className="flex flex-col gap-1 w-full">
                                <div className="body-3 font-semibold">{item.label}</div>
                                <div className="px-2 py-2 bg-accent-base body-3 rounded">{item.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {transactions.length === 0 ? (
                            <p className="text-center text-xs text-neutral-400">Tidak ada transaksi</p>
                    ) : error ? (
                        <>
                            {toast.error("Terjadi kesalahan saat memuat transaksi")}
                            <p className="text-center text-xs text-danger">Tidak ada transaksi</p>
                        </>
                    ) : (
                        transactions.map((transaction) => (
                            <div
                                key={transaction.wo}
                                className="flex justify-between items-center border-b pb-4 last:border-0 text-sm"
                            >
                                <div className="flex flex-col">
                                    <p className="body-3 font-medium">{transaction.type}</p>
                                    <p className="body-3 text-neutral-500">
                                        {new Date(transaction.time).toLocaleDateString("id-ID")}
                                    </p>
                                </div>
                                <p
                                    className={`text-right ${transaction.type === "credit"
                                        ? "text-success"
                                        : "text-danger"
                                        }`}
                                >
                                    {transaction.type === "credit" ? "+" : "-"}Rp{transaction.nominal}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Logout Button */}
            {activeTab === 'ringkasan' && (
                <div className="flex justify-end">
                    <Button
                        onClick={() => setIsLogoutDialogOpen(true)}
                        className="flex items-center text-sm py-1 px-3"
                        variant="danger"
                    >
                        Logout
                    </Button>
                </div>
            )}

            {/* Logout Confirmation Dialog */}
            {isLogoutDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-4 shadow-md w-3/4">
                        <p className="body-2 font-semibold mb-7 text-center">
                            Apakah Anda yakin ingin logout?
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button
                                variant="primary"
                                className="body-2 flex w-1/2 justify-center py-1"
                                onClick={() => setIsLogoutDialogOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="danger"
                                className="body-2 flex w-1/2 justify-center py-1"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default UserProfileComponent;