'use client'

import React from "react"
import { useRouter } from "next/navigation"
import FormRequest from "./form-request"
import HeroProfile from "../profile/header"
import { useUser } from "@/components/hooks/useUser"

export default function CreateRequest() {
    const router = useRouter()
    const { userData, error, loading } = useUser()

    return (
        <div className="flex flex-col h-screen w-full max-w-md mx-auto px-4 py-6">
            <HeroProfile userData={userData} />

            <div className="flex space-x-4 sm:space-x-6 border-b mt-6 overflow-x-auto">
                <p className="pb-2">Pengajuan Dana</p>
            </div>

            <div className="flex-1 overflow-y-auto">
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                <FormRequest />
            </div>
        </div>
    )
}
