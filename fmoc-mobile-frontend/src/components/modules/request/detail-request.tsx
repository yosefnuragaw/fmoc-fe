'use client';

import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import HeroProfile from "@/components/modules/profile/header";
import { useUser } from "@/components/hooks/useUser";
import { useDetailRequestDana } from "@/components/hooks/useDetailRequestDana";
import { cancelRequest } from "@/components/hooks/useCancelRequest";
import { Button } from "@/components/ui/button";
import { FaHistory } from "react-icons/fa";
import StatusHistoryPopup from "@/components/ui/dialog-status";
import LoadingSpinner from "@/components/ui/loading-spinner";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function DetailRequest() {
  const  params  = useParams();
  const router = useRouter();
  const rawId = params.id;
  if (typeof rawId !== 'string') {
    // Optional: redirect back or render a fallback while we sort out the param
    useEffect(() => {
      router.push('/home');      // or wherever makes sense
    }, [router]);

    return <p>Loading…</p>;
  }
  const requestId = rawId;  

  
  const [activeTab, setActiveTab] = useState<'req' | 'set'>('req');
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  const { userData, loading: userLoading, error: userError } = useUser();
  const { data, loading: dataLoading, error: dataError } = useDetailRequestDana(requestId);

  useEffect(() => {
    if (!requestId) return;

    if (cancelSuccess) {
      toast.success("Pengajuan dana berhasil dibatalkan");
      router.push("/home");
    }
  }, [cancelSuccess, router]);

  useEffect(() => {
    if (!requestId) return;
    fetchStatusHistory();
  }, [requestId]);

  async function fetchStatusHistory() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/requestdana/approval/history/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil riwayat status request");
      }

      const jsonData = await response.json();
      const historyData = jsonData.data.map((item: any) => ({
        status: item.status,
        time: new Date(item.time).toLocaleString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));
      setStatusHistory(historyData);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Terjadi kesalahan saat mengambil riwayat status request");
    }
  }

  const handleCancel = async () => {
    try {
      await cancelRequest(requestId);
      setCancelSuccess(true);
    } catch (err: any) {
      toast.error(err.message || "Gagal membatalkan permintaan.");
    }
  };

  if (userLoading || dataLoading) return <div className="flex justify-center min-h-screen items-center"><LoadingSpinner /></div>;
  if (userError || dataError) return <p className="text-red-500 text-center mt-10">{userError || dataError}</p>;

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto px-4">
      <HeroProfile userData={userData} />

      <div className="top-[80px] z-10 border-b mt-2">
        <div className="flex justify-between items-center text-xs font-medium border-b pt-6 px-1">
          <StatusHistoryPopup
            open={isStatusDialogOpen}
            onClose={() => setIsStatusDialogOpen(false)}
            statusHistory={statusHistory}
          />
          {/* Tab buttons */}
          <div className="flex space-x-4 sm:space-x-6">
            {["req", ...(data?.approved && data?.end ? ["set"] : [])].map((tab) => (
              <button
                key={tab}
                className={`pb-2 ${activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 border-b-2 border-transparent"
                  }`}
                onClick={() => {
                  if (tab === "set") {
                    router.push(`/settlement/${requestId}`);
                  } else {
                    setActiveTab("req");
                  }
                }}
              >
                {tab === "req" ? "Pengajuan Dana" : "Settlement"}
              </button>
            ))}
          </div>

          {/* Cancel button */}
          {(data?.approved === false && data?.end === false ) && (
            <button
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md mb-2"
              onClick={handleCancel}
            >
              Batalkan
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 pb-12">
        <div className="flex flex-col gap-3 p-4">
          <div className="flex">
            {(data?.status.includes("Transferred") || data?.status.includes("Reimbursed")) && (
              <Button
                className="flex items-center gap-1 border-success text-success w-full justify-center body-2"
                variant="outline_success"
                onClick={() => setIsStatusDialogOpen(true)}
              >
                <FaHistory /> {data?.status}
              </Button>
            )}
            {(data?.status.includes("Approved by")) && (
              <Button
                className="flex items-center gap-1 border-success text-success w-full justify-center body-4"
                variant="outline_success"
                onClick={() => setIsStatusDialogOpen(true)}
              >
                <FaHistory /> {data?.status}
              </Button>
            )}
            {data?.status.includes("approval from") || data?.status.includes("Waiting") && (
              <Button
                className="flex items-center gap-1 border-warning text-warning w-full justify-center body-3"
                variant="outline_warning"
                onClick={() => setIsStatusDialogOpen(true)}
              >
                <FaHistory /> {data?.status}
              </Button>
            )}
            {data?.status.includes("Rejected") && (
              <Button
                className="flex items-center gap-1 border-destructive text-destructive w-full justify-center body-3"
                variant="outline_danger"
                onClick={() => setIsStatusDialogOpen(true)}
              >
                <FaHistory /> {data?.status}
              </Button>
            )}
            {data?.status.includes("Pending") && data?.status.includes("approval") && (
              <Button
                className="flex items-center gap-1 border-warning text-warning w-full justify-center body-3"
                variant="outline_warning"
                onClick={() => setIsStatusDialogOpen(true)}
              >
                <FaHistory /> {data?.status}
              </Button>
            )}
          </div>
          {[
            { label: "WO", value: data?.wo },
            { label: "Kategori", value: data?.category },
            { label: "Nominal", value: data?.nominal ? `Rp ${data.nominal.toLocaleString("id-ID")}` : "-" },
            { label: "Tanggal Pengajuan", value: data?.submissionDate ? new Date(data.submissionDate).toLocaleDateString("id-ID") : "-" },
          ].map((item, index) => (
            <div key={index} className="flex flex-col gap-1 w-full">
              <div className="body-3 font-semibold">{item.label}</div>
              <div className="px-2 py-2 bg-accent-base body-3 rounded text-sm text-neutral-700">{item.value || "-"}</div>
            </div>
          ))}

          {/* Image section */}
          <div className="flex flex-col gap-1 w-full">
            <div className="body-3 font-semibold">Bukti Pengajuan Dana</div>
            {data?.imgData ? (
              <div className="rounded bg-white shadow overflow-hidden">
                <img
                  src={data.imgData}
                  alt="Image Data"
                  className="w-full h-[200px] object-cover"
                />
              </div>
            ) : (
              <div className="px-2 py-2 bg-accent-base body-3 rounded text-sm text-neutral-600">No image available</div>
            )}
          </div>

          {/* Image section */}
          <div className="flex flex-col gap-1 w-full">
            <div className="body-3 font-semibold">Bukti Transfer</div>
            {data?.imgDisbursement ? (
              <div className="rounded bg-white shadow overflow-hidden">
                <img
                  src={data.imgDisbursement}
                  alt="Image Data"
                  className="w-full h-[200px] object-cover"
                />
              </div>
            ) : (
              <div className="px-2 py-2 bg-accent-base body-3 rounded text-sm text-neutral-600">No image available</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}