"use client";
import { useEffect, useState } from "react";
import { useRouter }   from 'next/navigation';
import { toast } from 'sonner';
import CreateSettlement from "@/components/modules/settlement/create-settlement";
import FillSettlement from "@/components/modules/settlement/fill-settlement";
import DetailSettlement from "@/components/modules/settlement/detail-settlement";
import type { SettlementDetails } from "@/components/model/settlement/models";
import axios from 'axios';
import LoadingSpinner from "@/components/ui/loading-spinner";

interface Props {
    requestDanaId: string;
}

export default function SettlementSection({ requestDanaId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "not_created" | "created_empty" | "filled">("loading");
  const [detail, setDetails] = useState<SettlementDetails | null>(null);

  useEffect(() => {
    (async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not logged in');

        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/settlement/manage/detail/${requestDanaId}`,
                { headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
                    validateStatus: () => true
                }
        );

        if (res.status == 200) {
            const settlementData: SettlementDetails = res.data.data
            setDetails(settlementData)

            const isFilled = res.data.data.status !== "NOT FILLED";
            setStatus(isFilled ? "filled" : "created_empty");
            
        }

        else if (res.status == 204) {
            setStatus("not_created")
        }

        else {
            toast.error(res.data.message)
            router.push(`/home/${requestDanaId}`)
        }

    })();
  }, [requestDanaId, router]);

  if (status === "loading") return <div className="flex justify-center min-h-screen items-center"><LoadingSpinner /></div>;

  switch (status) {
    case "not_created":
      return <CreateSettlement requestDanaId = {requestDanaId}/>;
    case "created_empty":
      return <FillSettlement requestDanaId = {requestDanaId}/>;
    case "filled":
        return detail ? <DetailSettlement detail={detail} requestDanaId = {requestDanaId}/> : <p>Error: No data</p>;
    default:
      return <p>Error: Unknown status</p>;
  }
}
