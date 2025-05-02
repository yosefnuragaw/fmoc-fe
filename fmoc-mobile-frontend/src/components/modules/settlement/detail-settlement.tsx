"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import type { SettlementDetails } from "@/components/model/settlement/models";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { FaHistory } from "react-icons/fa";
import StatusHistoryPopup from "@/components/ui/dialog-status";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface SettlementDetailProps {
  detail: SettlementDetails;
  requestDanaId: string;
}

export default function SettlementDetail({ detail, requestDanaId }: SettlementDetailProps) {
  const router = useRouter();
  const [statusHistory, setStatusHistory] = useState<any[]>([]);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  useEffect(() => {
    if (!requestDanaId) return;
    fetchStatusHistory();
  }, [requestDanaId]);

  async function fetchStatusHistory() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}/settlement/approval/history/${requestDanaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil riwayat status settlement");
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
      toast.error("Terjadi kesalahan saat mengambil riwayat status settlement");
    }
  }

  const handleCreate = async () => {

    const token = localStorage.getItem('token');
    if (!token) throw new Error('Belum login');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.UUID;

    const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/settlement/manage/create`,
    { requestDanaId, userId },
    { headers: { Authorization: `Bearer ${token}` }, validateStatus: () => true},
    
);

    if (res.status == 201) {
        toast.success(res.data.message)
        router.push(`/settlement/detail/${requestDanaId}`);
    } 

    else {
        toast.error(res.data.message)
    }
  };


  return (

      <div className="flex-1 overflow-y-auto pb-12">
        <div className="flex flex-col gap-3 p-4">
          
        <StatusHistoryPopup
            open={isStatusDialogOpen}
            onClose={() => setIsStatusDialogOpen(false)}
            statusHistory={statusHistory}
        />
          <div className="flex">
              {detail?.status.includes("Approved by") && (
                  <Button className="flex items-center gap-1" variant="outline_success" onClick={() => setIsStatusDialogOpen(true)}><FaHistory /> {detail?.status}</Button>
              )}
              {detail?.status.includes("Pending") && (
                  <Button className="flex items-center gap-1" variant="outline_warning" onClick={() => setIsStatusDialogOpen(true)}><FaHistory /> {detail?.status}</Button>
              )}
              {detail?.status.includes("Rejected") && (
                <>
                  <Button
                    className="flex items-center gap-1 text-xs py-1 px-2 h-auto"
                    variant="outline_danger"
                    onClick={() => setIsStatusDialogOpen(true)}
                  >
                    <FaHistory /> {detail.status}
                  </Button>

                  <Button
                    className="text-xs py-1 px-2 h-auto"
                    variant="primary"
                    onClick={() => handleCreate()}
                  >
                    Ajukan Ulang
                  </Button>
                </>
              )}
              {detail?.status.includes("Transferred") && (
                  <Button className="flex items-center gap-1" variant="success" onClick={() => setIsStatusDialogOpen(true)}><FaHistory /> {detail?.status}</Button>
              )}
          </div>
          {[
            { label: "Nominal Digunakan", value: detail.usageNominal ? `Rp ${detail.usageNominal.toLocaleString("id-ID")}` : "-" },
            { label: "Tanggal Transaksi", value: detail.transactionDate ? new Date(detail.transactionDate).toLocaleDateString("id-ID") : "-" },
            { label: "Deskripsi", value: detail.description },
          ].map((item, index) => (
            <div key={index} className="flex flex-col gap-1 w-full">
              <div className="body-3 font-semibold">{item.label}</div>
              <div className="px-2 py-2 bg-accent-base body-3 rounded text-sm text-neutral-700">{item.value || "-"}</div>
            </div>
          ))}

          {/* Bukti Penggunaan Dana */}
          <div className="flex flex-col gap-1 w-full">
            <div className="body-3 font-semibold">Bukti Penggunaan Dana</div>
            {detail.buktiPenggunaanDanaUrl ? (
              <div className="rounded bg-white shadow overflow-hidden">
                <img
                  src={detail.buktiPenggunaanDanaUrl}
                  alt="Bukti Penggunaan Dana"
                  className="w-full h-[200px] object-cover"
                />
              </div>
            ) : (
              <div className="px-2 py-2 bg-accent-base body-3 rounded text-sm text-neutral-600">Tidak ada bukti</div>
            )}
          </div>

          {/* Lampiran Tambahan */}
          <div className="flex flex-col gap-1 w-full">
            <div className="body-3 font-semibold">Lampiran</div>
            {detail.additionalSettlementUrl ? (
              <a
                href={detail.additionalSettlementUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                Lihat Lampiran
              </a>
            ) : (
              <div className="px-2 py-2 bg-accent-base body-3 rounded text-sm text-neutral-600">Tidak ada lampiran</div>
            )}
          </div>
        </div>
      </div>
  );
}
