"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Area, UserData } from "@/components/model/profile/models";

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
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [filterPeriode, setFilterPeriode] = useState<'All' | 'Last 7 days' | 'Last 30 days'>('All');

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

    const formatCurrency = (value: number | null): string => {
        if (value == null) {
          return "–";
        }
      
        if (isNaN(value)) {
          return "–";
        }
      
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(value);
      };

    const formatValue = (value: string | null) => (value ? value : "-");

    const filteredSortedTransactions = [...transactions]
        .filter((row) => {
            const time = new Date(row.time);
            return (
                filterPeriode === 'All' ||
                (filterPeriode === 'Last 7 days' &&
                    time >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                (filterPeriode === 'Last 30 days' &&
                    time >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
            );
        })
        .sort((a, b) => {
            const timeA = new Date(a.time).getTime();
            const timeB = new Date(b.time).getTime();
            return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
        });


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

    return (
        <div className="rounded-md shadow-md overflow-hidden flex flex-col p-4 md:p-7 gap-4 bg-white">
            {/* Header */}
            <div className="h-10 border-b-2 border-accent-base flex items-center pb-4">
                <h2 className="text-lg font-bold">Informasi Pengguna</h2>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b -mt-2">
                <button
                    className={`flex-1 py-1 text-xs font-medium ${activeTab === "ringkasan"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 border-b-2 border-transparent"
                        }`}
                    onClick={() => setActiveTab("ringkasan")}
                >
                    Profil
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
                (!userData) ? (
                    <p className="text-center text-xs text-neutral-400">Profil tidak ditemukan</p>
                ) : (
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex flex-col gap-3 w-full md:w-1/2">
                            {[{ label: "Nama", value: userData.name },
                            { label: "Saldo", value: formatCurrency(userData.saldo) },
                            { label: "Email", value: userData.email }].map((item, index) => (
                                <div key={index} className="flex flex-col gap-1 w-full">
                                    <div className="body-3 font-semibold">{item.label}</div>
                                    <div className="px-2 py-2 bg-accent-base body-3 rounded">{item.value}</div>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-1/2">
                            {[
                                { label: "Nomor Rekening", value: formatValue(userData.nomorRekening) },
                                { label: "Nomor Mobil", value: formatValue(userData.nomorMobil) },
                                { label: "Nomor Genset", value: formatValue(userData.nomorGenset) },
                                { label: "Area", value: formatArea(userData.area) }].map((item, index) => (
                                    <div key={index} className="flex flex-col gap-1 w-full">
                                        <div className="body-3 font-semibold">{item.label}</div>
                                        <div className="px-2 py-2 bg-accent-base body-3 rounded">{item.value}</div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )
            ) : (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center -mt-2">
                        <select
                            value={sortDirection}
                            onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                            className="border px-2 py-1 rounded body-3 text-gray-500"
                        >
                            <option value="desc">Terbaru</option>
                            <option value="asc">Terlama</option>
                        </select>

                        <select
                            value={filterPeriode}
                            onChange={(e) => setFilterPeriode(e.target.value as 'All' | 'Last 7 days' | 'Last 30 days')}
                            className="border px-2 py-1 rounded body-3 text-gray-500"
                        >
                            <option value="All">Semua</option>
                            <option value="Last 7 days">7 Hari Terakhir</option>
                            <option value="Last 30 days">30 Hari Terakhir</option>
                        </select>
                    </div>

                    {transactions.length === 0 ? (
                        <p className="text-center text-xs text-neutral-400">Tidak ada transaksi</p>
                    ) : error ? (
                        <>
                            {toast.error("Terjadi kesalahan saat memuat transaksi")}
                            <p className="text-center text-xs text-danger">Tidak ada transaksi</p>
                        </>
                    ) : (
                        filteredSortedTransactions.map((transaction) => {
                            const isCredit = transaction.type === "Settlement";
                            const tanggal = new Date(transaction.time);
                            const day = tanggal.getDate();
                            const monthYear = tanggal.toLocaleDateString("id-ID", {
                                month: "short",
                                year: "numeric",
                            });

                            const formattedNominal = new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 2,
                            }).format(transaction.nominal);

                            return (
                                <div
                                    key={transaction.wo}
                                    className="flex items-center gap-3 p-2 border rounded-md bg-white shadow-sm"
                                >
                                    <div className="bg-accent-base text-center rounded-md px-1.5 py-2 shrink-0">
                                        <div className="body-2 font-semibold leading-none">{day}</div>
                                        <div className="body-4 font-medium uppercase tracking-wide">
                                            {monthYear}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1 flex-1">
                                        <p className="body-3 font-semibold">{transaction.type} Diterima</p>
                                        <span
                                            className={`body-4 font-semibold px-2 py-1 rounded w-fit ${isCredit ? "bg-red-200 text-danger-900" : "bg-green-200 text-success-900"
                                                }`}
                                        >
                                            {isCredit ? "- " : "+ "}
                                            {formattedNominal}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
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