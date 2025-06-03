'use client'

import React from "react"
import { useRouter } from "next/navigation"
import FormRequest from "./form-request"
import HeroProfile from "../profile/header"
import { useUser } from "@/components/hooks/useUser"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function CreateRequest() {
    const router = useRouter()
    const { userData, error, loading } = useUser()

    return (
        <div className="flex flex-col h-screen w-full max-w-md mx-auto px-4">
            <HeroProfile userData={userData} />

            <div className="flex space-x-4 sm:space-x-6 border-b mt-6 ">
                <p className="pb-2 text-xs font-medium text-blue-600 border-b-2 border-blue-600">Pengajuan Dana</p>
                {loading && <div className="flex justify-center min-h-screen items-center"><LoadingSpinner /></div>}

            </div>

            <div className="flex-1">
                {error && <p className="text-red-500">{error}</p>}
                <FormRequest />
            </div>
        </div>
    )
}
