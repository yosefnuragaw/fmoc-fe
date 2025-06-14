'use client';

import SettlementSection from "@/components/modules/settlement/settlement-section";
import { useUser } from '@/components/hooks/useUser';
import RequestTab from '@/components/ui/request-tab';
import HeroProfile from '../profile/header';
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function SettlementPage() {
  const  params  = useParams();
  const router = useRouter();
  const rawId = params.id;
  if (typeof rawId !== 'string') {
      useEffect(() => {
        router.push('/home');
      }, [router]);
  
      return <div className="flex justify-center min-h-screen items-center"><LoadingSpinner /></div>;
    }
    const requestDanaId = rawId; 
  const { userData, loading: userLoading, error: userError } = useUser()
  
  if (userLoading ) return <div className="flex justify-center min-h-screen items-center"><LoadingSpinner /></div>
  if (userError ) return <p className="text-red-500 text-center mt-10">{userError }</p>

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto px-4">
        <HeroProfile userData={userData} />

        <div className="top-[80px] z-10 border-b mt-2">
            <div className="flex justify-between items-center text-xs font-medium border-b pt-6 px-1">
          
              {/* request tab */}
              <RequestTab requestDanaId={requestDanaId} />
          
            </div>
        </div>

          <SettlementSection requestDanaId={requestDanaId} />

    </div>
  );
}
