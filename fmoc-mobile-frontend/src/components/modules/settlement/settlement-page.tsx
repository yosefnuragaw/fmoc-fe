'use client';

import SettlementSection from "@/components/modules/settlement/settlement-section";
import { useUser } from '@/components/hooks/useUser';
import RequestTab from '@/components/ui/request-tab';
import HeroProfile from '../profile/header';

export default function SettlementPage({ requestDanaId }: { requestDanaId: string }) {

  
  const { userData, loading: userLoading, error: userError } = useUser()
  
  if (userLoading ) return <p className="text-center mt-10">Loading...</p>
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
