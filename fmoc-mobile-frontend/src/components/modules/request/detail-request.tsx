'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import HeroProfile from "@/components/modules/profile/header"
import { useUser } from "@/components/hooks/useUser"
import { useDetailRequestDana } from "@/components/hooks/useDetailRequestDana"

interface DetailRequestProps {
  requestId: string
}

export default function DetailRequest({ requestId }: DetailRequestProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'req' | 'set'>('req')

  const { userData, loading: userLoading, error: userError } = useUser()
  const { data, loading: dataLoading, error: dataError } = useDetailRequestDana(requestId)

  if (userLoading || dataLoading) return <p className="text-center mt-10">Loading...</p>
  if (userError || dataError) return <p className="text-red-500 text-center mt-10">{userError || dataError}</p>


  console.log(data?.imgData)
  console.log(data?.end)
  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto px-4">
      <HeroProfile userData={userData} />

      <div className="top-[80px] z-10 border-b mt-2">
        <div className="flex justify-between items-center text-xs font-medium border-b pt-6 px-1">
            {/* Tab buttons */}
            <div className="flex space-x-4 sm:space-x-6">
            {["req", ...(data?.end ? ["set"] : [])].map((tab) => (
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
                    onClick={() => router.back()}
                >
                    Batalkan
                </button>
                )}
        </div>        
      </div>

      <div className="flex-1 overflow-y-auto pb-12">
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
                src={data.imgData} // assuming href URL, not base64
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
  )
}
