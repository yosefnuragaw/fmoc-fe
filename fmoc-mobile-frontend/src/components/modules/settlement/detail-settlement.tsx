"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from 'sonner';
import type { SettlementDetails } from "@/components/model/settlement/models";
import { useUser } from "@/components/hooks/useUser";

interface SettlementDetailProps {
  detail: SettlementDetails;
}

export default function SettlementDetail({ detail }: SettlementDetailProps) {
  const router = useRouter();
  const { userData, loading: userLoading, error: userError } = useUser();

  return (
      <div className="flex-1 overflow-y-auto pb-12">
        <div className="flex flex-col gap-3 p-4">
          {[
            { label: "Kategori", value: detail.category },
            { label: "Nominal Digunakan", value: detail.usageNominal ? `Rp ${detail.usageNominal.toLocaleString("id-ID")}` : "-" },
            { label: "Status", value: detail.status },
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
