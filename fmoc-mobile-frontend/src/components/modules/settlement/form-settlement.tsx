/* ─────────────────────────  app/(mobile)/settlement/form-settlement.tsx ───────────────────── */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams }   from 'next/navigation';
import Input        from '@/components/ui/input';
import { Button }   from '@/components/ui/button';
import CameraCapture from '@/components/cam/camera-capture';
import axios        from 'axios';
import { toast }    from 'sonner';

import { SettlementRequest } from '@/components/model/settlement/models';

/* ────────────────────────────  TYPES & BLANK STATE  ────────────────────────── */

type FormState = SettlementRequest & {
  /** extra field only used on the client side */
  buktiPenggunaanDanaImgData: string | null;   // ← camera base-64
};

/** minimal values so TS stops complaining – will be replaced by API data */
const blank: FormState = {
  settlementId : '',
  userId       : '',
  usageNominal : 0,
  transactionDate : '',
  submissionDate  : '',
  latitude     : null,
  longitude    : null,
  description  : '',
  buktiPenggunaanDanaImgData: null
};

/** which fields come from the server and must be shown read-only */
const locked: (keyof FormState)[] = [
  'settlementId',
  'userId',
  'submissionDate',
  'latitude',
  'longitude'
];

/* ─────────────────────────────  COMPONENT  ──────────────────────────────── */

export default function FormSettlement() {
  /* --------------- hooks & state --------------- */
  const router     = useRouter();
  const params     = useParams<{ requestDanaId: string }>();   // page is /settlement/fill/[id]
  const [form, setForm] = useState<FormState>(blank);

  const [loading , setLoading ] = useState(false);  // disables SUBMIT
  const [posting , setPosting ] = useState(false);  // disables CREATE
  const [preview, setPreview] = useState<string | null>(null);
  const [showCam , setShowCam ] = useState(false);
  const [imgKey, setImgKey] = useState<number>(Date.now());

  /* ─── 1. fetch settlement details on mount ─────────────────────────── */
  useEffect(() => {
    (async () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not logged in');

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/settlement/manage/detail/${params.requestDanaId}`,
          { headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'},
            validateStatus: () => true}
        );

        if (res.status == 200) {
            toast.success(res.data.message)
            setForm({
                ...blank,
                ...res.data.data,                   // <- API shape = SettlementRequest
                buktiPenggunaanDanaImgData: null,   // camera not taken yet
              });
          } 
    
          else {
              toast.error(res.data.message)
              router.replace(`/home`);
          }
        
    })();
  }, [params.requestDanaId, router]);

  /* ─── 2. helpers ───────────────────────────────────────────────────── */
  const persist = (f: FormState) =>
    localStorage.setItem('settlementForm', JSON.stringify(f));

  /** any standard ISO string trimmed to YYYY-MM-DDTHH:mm:ss */
  const iso = (d: Date) => d.toISOString().slice(0, 19);

  /* ─── 3. handlers ──────────────────────────────────────────────────── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    /* ignore edits to locked fields */
    if (locked.includes(name as keyof FormState)) return;

    const updated = {
      ...form,
      [name]:
        name === 'usageNominal'
          ? parseFloat(value.replace(/[^0-9.]/g, '')) || 0
          : value
    };
    setForm(updated);
    persist(updated);
  };

  const onCapture = (cap: { imageData: string; lat: number|null; lon: number|null }) => {
    setForm(f => ({
      ...f,
      buktiPenggunaanDanaImgData: cap.imageData,
      latitude : cap.lat,
      longitude: cap.lon
    }));
    setPreview(cap.imageData);
    setShowCam(false);
    setImgKey(Date.now());
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.buktiPenggunaanDanaImgData) {
      toast.error('Upload bukti transaksi dulu');
      return;
    }

    setPosting(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not logged in');

      const body = {
        ...form,
        submissionDate: iso(new Date())
      };

    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/settlement/manage/fill`,
        body,
        { headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
            validateStatus: () => true }
      );

      if (res.status == 200) {
        toast.success(res.data.message)
        router.replace('/home')
      } 

      else {
          toast.error(res.data.message)  
      }
  };

  /* ─── 4. render ────────────────────────────────────────────────────── */
  return (
    <div className="p-6 relative">
      {/* camera modal */}
      {showCam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <CameraCapture onCaptureComplete={onCapture}
                         onClose={() => setShowCam(false)} />
        </div>
      )}

      <form onSubmit={submit} className="flex flex-col gap-5">
        {/* ====== read-only fields ====== */}
        <Input label="Settlement ID"      name="settlementId"
               value={form.settlementId}  readOnly />
        <Input label="User ID"            name="userId"
               value={form.userId}        readOnly />

        {/* ====== editable fields ====== */}
        <Input label="Nominal Dipakai" name="usageNominal"
               value={form.usageNominal}
               onChange={handleChange} required />

        <Input type="datetime-local"  label="Tanggal Transaksi"
               name="transactionDate"
               value={form.transactionDate}
               onChange={handleChange} required />

        <label className="text-xs font-semibold">Deskripsi*</label>
        <textarea name="description"
                  className="border rounded-md p-2 bg-accent-base resize-none"
                  value={form.description}
                  onChange={handleChange} required />

        {/* ====== bukti foto ====== */}
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold">Bukti&nbsp;Transaksi*</label>
          <Button type="button" variant="primary"
                  onClick={() => setShowCam(true)}>
            Capture Photo
          </Button>
        </div>

        <div className="bg-accent-base mt-2 p-3 rounded-md flex justify-center">
            {preview ? (
              <img
                key={imgKey}
                src={`data:image/jpeg;base64,${preview}`}
                alt="Invoice Preview"
                width={240}
                height={80}
                className="rounded-md"
              />
            ) : (
              <div className="w-[240px] h-[80px] flex items-center justify-center text-gray-400">
                No photo
              </div>
            )}
          </div>

        {/* ====== submit ====== */}
        <div className="flex justify-end">
          <Button variant="primary" type="submit" disabled={posting}>
            {posting ? 'Submitting…' : 'Submit Settlement'}
          </Button>
        </div>
      </form>
    </div>
  );
}
