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

            <div className="flex space-x-4 sm:space-x-6 border-b mt-6 overflow-x-auto">
                {["ongoing", "history"].map((tab) => (
                    <button
                        key={tab}
                        className={`pb-2 ${
                            activeTab === tab
                                ? "border-b-2 border-primary text-primary"
                                : "text-neutral-600"
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
