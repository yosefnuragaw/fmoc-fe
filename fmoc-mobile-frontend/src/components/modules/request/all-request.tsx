'use client'

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { RequestCardList } from "./column-request"
import HeroProfile from "../profile/header"
import { useUser } from "@/components/hooks/useUser"
import { useRequestData } from "@/components/hooks/useRequestDana"

export default function AllRequest() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'ongoing' | 'history'>('ongoing')

    const { userData, loading: userLoading, error: userError } = useUser()
    const { data, loading: dataLoading, error: dataError } = useRequestData()

    if (userLoading || dataLoading) return <p className="text-center mt-10">Loading...</p>
    if (userError || dataError) return <p className="text-red-500 text-center mt-10">{userError || dataError}</p>

    return (
        <div className="flex flex-col h-screen w-full max-w-md mx-auto px-4 ">
            <HeroProfile userData={userData} />

            <div className="flex text-xs font-medium space-x-4 sm:space-x-6 border-b pt-6 ">
                {["ongoing", "history"].map((tab) => (
                    <button
                        key={tab}
                        className={`pb-2 ${
                            activeTab === tab
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "ttext-gray-500 border-b-2 border-transparent"
                        }`}
                        onClick={() => setActiveTab(tab as 'ongoing' | 'history')}
                    >
                        {tab === "ongoing" ? "Pengajuan Aktif" : "Riwayat"}
                    </button>
                ))}
            </div>

            <div className="flex-1 pb-12">
                <RequestCardList data={data} selectSettled={activeTab === "history"} />
            </div>
        </div>
    )
}
