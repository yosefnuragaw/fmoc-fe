'use client'

import React, { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { RequestCardList } from "./column-request"
import HeroProfile from "../profile/header"
import { useUser } from "@/components/hooks/useUser"
import { useRequestData } from "@/components/hooks/useRequestDana"
import LoadingSpinner from "@/components/ui/loading-spinner"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import { HiMiniChevronDown } from "react-icons/hi2";
import { Button } from "@/components/ui/button"

export default function AllRequest() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'ongoing' | 'history'>('ongoing')
    const [filterKategori, setFilterKategori] = useState("All")
    const [filterStatus, setFilterStatus] = useState("All")
    const { userData, loading: userLoading, error: userError } = useUser()
    const { data, loading: dataLoading, error: dataError } = useRequestData()

    

    

    const filteredData = useMemo(() => {
    if (!data || data.length === 0) return []


    return data.filter((item) => {
      const matchesKategori =
        filterKategori === "All" ||
        item.category?.toLowerCase() === filterKategori.toLowerCase()


      const matchesStatus =
        filterStatus === "All" ||
        item.status?.toLowerCase().includes(filterStatus.toLowerCase())


      return matchesKategori && matchesStatus
    })
    }, [data, activeTab, filterKategori, filterStatus])
    
    if (userLoading || dataLoading) return <div className="flex justify-center min-h-screen items-center"><LoadingSpinner /></div>;
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
            
            <div className="flex gap-2 mt-4 overflow-x-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="flex gap-2 items-center text-sm px-3 py-1 h-auto">
                    {filterKategori === "All" ? "Kategori" : filterKategori}
                    <HiMiniChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Kategori</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filterKategori} onValueChange={setFilterKategori}>
                    <DropdownMenuRadioItem value="All">Semua</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="BBM Mobil">BBM Mobil</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="BBM Motor">BBM Motor</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Toll">Toll</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Parkir">Parkir</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>


            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="flex gap-2 items-center text-sm px-3 py-1 h-auto">
                    {filterStatus === "All" ? "Status" : filterStatus}
                    <HiMiniChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={filterStatus} onValueChange={setFilterStatus}>
                        <DropdownMenuRadioItem value="All">Semua</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Pending">Pending</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Approved">Approved</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Rejected">Rejected</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Transferred">Transferred</DropdownMenuRadioItem>
                        {activeTab === "history" && (
                            <DropdownMenuRadioItem value="Settled">Settled</DropdownMenuRadioItem>
                        )}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex-1 pb-12">
                <RequestCardList data={data} selectSettled={activeTab === "history"} />
            </div>
        </div>
    )
}
