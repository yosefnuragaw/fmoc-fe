"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import type { SettlementDetails } from "@/components/model/settlement/models";
import HeroProfile from "@/components/modules/profile/header";
import { useUser } from "@/components/hooks/useUser";

interface SettlementDetailProps {
  detail: SettlementDetails;
}

export default function SettlementDetail({ detail }: SettlementDetailProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'set'>('set');
  const { userData, loading: userLoading, error: userError } = useUser();

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto px-4">
          <HeroProfile userData={userData} />

      <div className="top-[80px] z-10 border-b mt-2">
        <div className="flex justify-between items-center text-xs font-medium border-b pt-6 px-1">
          {/* Tab (only Settlement here, but reusable structure) */}
          <div className="flex space-x-4 sm:space-x-6">
            <button
              className={`pb-2 ${
                activeTab === "set"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 border-b-2 border-transparent"
              }`}
              onClick={() => setActiveTab("set")}
            >
              Settlement
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-12">
        <div className="flex flex-col gap-3 p-4">
          {[
            { label: "Kategori", value: detail.category },
            { label: "Nominal Request", value: detail.nominal ? `Rp ${detail.nominal.toLocaleString("id-ID")}` : "-" },
            { label: "Nominal Penggunaan", value: detail.usageNominal ? `Rp ${detail.usageNominal.toLocaleString("id-ID")}` : "-" },
            { label: "Status", value: detail.status },
            { label: "Tanggal Transaksi", value: detail.transactionDate ? new Date(detail.transactionDate).toLocaleDateString("id-ID") : "-" },
            { label: "Tanggal Pengajuan", value: detail.submissionDate ? new Date(detail.submissionDate).toLocaleDateString("id-ID") : "-" },
            { label: "Deskripsi", value: detail.description },
            { label: "Latitude", value: detail.latitude?.toString() },
            { label: "Longitude", value: detail.longitude?.toString() },
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
            <div className="body-3 font-semibold">Lampiran Tambahan</div>
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
    </div>
  );
}
