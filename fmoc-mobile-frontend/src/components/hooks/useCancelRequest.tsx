// hooks/useRequestActions.ts
'use client'
import axios from "axios"

export async function cancelRequest(requestId: string): Promise<void> {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("Token not found")
  
    try {
      // Kalau endpoint PUT tidak butuh body, bisa pakai null atau {}
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/request/manage/${requestId}/cancel`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || err.message || "Gagal membatalkan permintaan.")
    }
  }
