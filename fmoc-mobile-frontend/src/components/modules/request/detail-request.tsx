'use client'

import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import HeroProfile from "@/components/modules/profile/header";
import { useUser } from "@/components/hooks/useUser";
import { useDetailRequestDana } from "@/components/hooks/useDetailRequestDana";
import { cancelRequest } from "@/components/hooks/useCancelRequest";


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

  const { userData, loading: userLoading, error: userError } = useUser();
  const { data, loading: dataLoading, error: dataError } = useDetailRequestDana(requestId);

  // Trigger toast and redirect if cancellation succeeded
  useEffect(() => {
    if (!requestId) return;

    if (cancelSuccess) {
      toast.success("Pengajuan dana berhasil dibatalkan");
      router.push("/home");
    }
  }, [cancelSuccess, router]);

  // Show loading or error early to avoid conditional hook issues
  if (userLoading || dataLoading) return <p className="text-center mt-10">Loading...</p>;
  if (userError || dataError) return <p className="text-red-500 text-center mt-10">{userError || dataError}</p>;

  const handleCancel = async () => {
    try {
      await cancelRequest(requestId);
      setCancelSuccess(true);
    } catch (err: any) {
      toast.error(err.message || "Gagal membatalkan permintaan.");
    }
  };


  console.log(data)
  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto px-4">
      <HeroProfile userData={userData} />

      <div className="top-[80px] z-10 border-b mt-2">
        <div className="flex justify-between items-center text-xs font-medium border-b pt-6 px-1">
          {/* Tab buttons */}
          <div className="flex space-x-4 sm:space-x-6">
            {["req", ...(data?.approved ? ["set"] : [])].map((tab) => (
              <button
                key={tab}
                className={`pb-2 ${
                  activeTab === tab
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 border-b-2 border-transparent"
                }`}
                onClick={() => setActiveTab(tab as 'req' | 'set')}
              >
                {tab === "req" ? "Pengajuan Dana" : "Settlement"}
              </button>
            ))}
          </div>

          {/* Cancel button */}
          {data?.approved === false && (
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
          {[
            { label: "WO", value: data?.wo },
            { label: "Kategori", value: data?.category },
            { label: "Nominal", value: data?.nominal ? `Rp ${data.nominal.toLocaleString("id-ID")}` : "-" },
            { label: "Status", value: data?.status },
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