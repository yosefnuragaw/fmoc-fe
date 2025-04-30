'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { DetailRequestDana } from "@/components/model/request/models"

export function useDetailRequestDana(id: string) {
    const [data, setData] = useState<DetailRequestDana | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token")

            if (!token) {
                setError("Token not found")
                setLoading(false)
                return
            }

            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/request/manage/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })

                const rawData = res.data.data

                const formattedData: DetailRequestDana = {
                    ...rawData,
                    transactionDate: rawData?.transactionDate ? new Date(rawData.transactionDate) : null,
                }

                setData(formattedData)
            } catch (err: any) {
                setError(err.message || "Error fetching request detail")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id]) // depend on `id`

    return { data, loading, error }
}
