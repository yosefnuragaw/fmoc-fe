'use client';

import React from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/components/hooks/useUser"
import HeroProfile from "../profile/header"
import FormSettlement from './form-settlement'

export default function CreateSettlement() {
const router = useRouter()
  const { userData, loading, error } = useUser();

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto px-4 py-6">
      <HeroProfile userData={userData} />

      <div className="flex space-x-4 border-b mt-6 overflow-x-auto">
        <p className="pb-2">Laporan&nbsp;Settlement</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && <p>Loading…</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && <FormSettlement />}
      </div>
    </div>
  );
}
