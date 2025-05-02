'use client';

import { useState } from 'react';
import { Button } from "../../ui/button";
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { useUser } from '@/components/hooks/useUser';

/* ───────────────────────────────────────────────────────── */

export default function CreateSettlement() {
  
  const router = useRouter();
  const params = useParams<{ requestDanaId: string }>();

  const [posting, setPosting] = useState(false);   // button spinner
  
  const { userData, loading: userLoading, error: userError } = useUser()
  
  if (userLoading ) return <p className="text-center mt-10">Loading...</p>
  if (userError ) return <p className="text-red-500 text-center mt-10">{userError }</p>

  /* click-handler --------------------------------------------------------- */
    const handleCreate = async () => {

    setPosting(true);

    const token = localStorage.getItem('token');
    if (!token) throw new Error('Belum login');
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.UUID;
    const requestDanaId = params.requestDanaId;

    const res = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/settlement/manage/create`,
    { requestDanaId, userId },
    { headers: { Authorization: `Bearer ${token}` }, validateStatus: () => true},
    
);

    if (res.status == 201) {
        toast.success(res.data.message)
        router.push(`/settlement/${requestDanaId}`);
    } 

    else {
        toast.error(res.data.message)
        setPosting(false);
    }
  };

  /* ─────────────── render ─────────────── */
  return (
      <div className="flex-1 overflow-y-auto pb-12">
        <div className="flex flex-col gap-3 p-4">
          <div className="flex justify-center mt-4">
            <Button type="submit" variant="primary" disabled={userLoading || posting} onClick={handleCreate}>
              {posting ? 'Processing…' : 'Create Settlement'}
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <button
              className="px-6 py-3 rounded-lg bg-primary text-white disabled:opacity-60"
              disabled={userLoading || posting}
              onClick={handleCreate}>
              {posting ? 'Processing…' : 'Create Settlement'}
            </button>
          </div>
        </div>
      </div>
  );
}
