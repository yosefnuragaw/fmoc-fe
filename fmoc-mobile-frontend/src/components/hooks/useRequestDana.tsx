// hooks/useRequestData.ts
'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { RequestDana } from "@/components/model/request/models"

export function useRequestData() {
    const [data, setData] = useState<RequestDana[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token")
            const id = localStorage.getItem("UUID")

            if (!token) {
                setError("Token not found")
                setLoading(false)
                return
            }

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/request/manage/all`, {
                    params: { id },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })

                const rawData = res.data.data || []
                const formattedData = rawData.map((item: { transactionDate: string }) => ({
                    ...item,
                    transactionDate: item.transactionDate ? new Date(item.transactionDate) : null,
                }))
                setData(formattedData)
            } catch (err: any) {
                setError(err.message || "Error fetching requests")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return { data, loading, error }
}
