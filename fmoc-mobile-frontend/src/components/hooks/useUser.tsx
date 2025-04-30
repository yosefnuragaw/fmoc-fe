import { useEffect, useState } from "react"
import axios from "axios"
import { UserData } from "@/components/model/profile/models"

export function useUser() {
    const [userData, setUserData] = useState<UserData>()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token")
            if (!token) {
                setError("Token not found")
                setLoading(false)
                return
            }

            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })

                if (response.data.status !== 200) throw new Error("Failed to fetch user data")
                setUserData(response.data.data)
            } catch (err: any) {
                setError(err.message || "An error occurred")
                console.error("Error fetching user data:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    return { userData, loading, error }
}
