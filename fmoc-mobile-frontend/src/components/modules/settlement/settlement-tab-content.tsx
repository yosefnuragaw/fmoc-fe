"use client";
import { useEffect, useState } from "react";
import { useRouter }   from 'next/navigation';
import axios from "axios";
import { toast } from "sonner";
import CreateSettlement from "@/components/modules/settlement/create-settlement";
import FillSettlement from "@/components/modules/settlement/fill-settlement";
import DetailSettlement from "@/components/modules/settlement/detail-settlement";
import type { SettlementDetails } from "@/components/model/settlement/models";

export default function SettlementTabContent({ requestDanaId }: { requestDanaId: string }) {
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "not_created" | "created_empty" | "filled">("loading");
    const [detail, setDetails] = useState<SettlementDetails | null>(null);

  useEffect(() => {
    const fetchSettlement = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not logged in');

        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/settlement/manage/detail/${requestDanaId}`,
                { headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
                    validateStatus: () => true
                }
        );

        if (res.status == 200) {
            toast.success(res.data.message)
            const settlementData: SettlementDetails = res.data
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

      } catch (err: any) {
        toast.error(err.message);
      }
    };

    fetchSettlement();
  }, [requestDanaId, router]);

  if (status === "loading") return <p>Loading settlement...</p>;

  switch (status) {
    case "not_created":
      return <CreateSettlement />;
    case "created_empty":
      return detail ? <FillSettlement detail={detail} /> : <p>Error: No data</p>;
    case "filled":
      return detail ? <DetailSettlement detail={detail} /> : <p>Error: No data</p>;
    default:
      return <p>Unknown status</p>;
  }
}
